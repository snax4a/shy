import braintreeClient from 'braintree-web/client';
import braintreeHostedFields from 'braintree-web/hosted-fields';
import braintreeApplePay from 'braintree-web/apple-pay';

class Item {
  constructor(id, name, price, quantity) {
    this.id = Number.parseInt(id, 10);
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity;
  }

  // Calculate the item total
  getTotal() {
    return parseFloat(this.quantity * this.price.toFixed(0));
  }
}

// Note: results of async functions are not part of the digest cycle so the component must use $timeout whenever an update is needed
export class Cart {
  /*@ngInject*/
  constructor($log, $window, $location, $http, $timeout, $q, ProductService) {
    // Setup dependency injections
    this.$log = $log;
    this.$window = $window;
    this.$location = $location;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$q = $q;
    this.productService = ProductService;

    // Initialize members
    this.key = 'cart'; // name of local storage key
    this.applePayEnabled = false; // default until checked
    this.initializeProperties();

    // Get token, setup Braintree client instance and Apple Pay instance (if applicable)
    // initialized property used to prevent navigation to checkout until we have a client instance
    this.initialized = this.braintreeInitialize();
  }

  initializeProperties() {
    this.cartItems = [];
    this.purchaser = {};
    this.recipient = {};
    this.instruction = '';
    this.gift = false;
    this.sendVia = 'Email';
    this.hostedFieldsState = {};
  }

  async braintreeInitialize() {
    try {
      // Load active product list
      this.products = await this.productService.productsGet(true);

      // Get token
      const response = await this.$http.get('api/token');
      const token = response.data;
      this.clientInstance = await braintreeClient.create({ authorization: token });

      // Check to see if browser supports Apple Pay
      if(this.applePayPossible()) {
        this.applePayInstance = await braintreeApplePay.create({ client: this.clientInstance });
        // Check to see if user has Apple Pay setup with a card
        this.applePayEnabled = await window.ApplePaySession.canMakePaymentsWithActiveCard(this.applePayInstance.merchantIdentifier);
      }

      // Successfully resolved all promises
      return true;
    } catch(err) {
      console.log('Error setting up Braintree', err);
      return false;
    }
  }

  // Returns a promise for the hostedFieldsInstance to the checkout component
  async braintreeHostedFieldsCreate() {
    this.hostedFieldsInstance = await braintreeHostedFields.create({
      client: this.clientInstance,
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '4111 1111 1111 1111'
        },
        cvv: {
          selector: '#cvv',
          placeholder: '123'
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: '10/2020'
        }
      },
      styles: {
        input: {
          'font-size': '14px',
          'font-family': 'Helvetica Neue, Helvetica, Arial, sans-serif',
          color: '#555'
        },
        ':focus': {
          'border-color': '#66afe9'
        },
        'input.invalid': {
          color: '#a94442'
        },
        'input.valid': {
          color: 'green'
        }
      }
    });

    this.braintreeHostedFieldsEventHandlers(['blur', 'focus', 'validityChange', 'notEmpty', 'empty']);
    return this.hostedFieldsInstance; // resolve promise (even though calling functions don't use the return value)
  }

  // Check to see whether Apple Pay is supported on the device so we know whether to display buttons
  applePayPossible() {
    try {
      return window.ApplePaySession && window.ApplePaySession.canMakePayments();
    } catch(err) { // Triggered by attempting Apple Pay on HTTP rather than HTTPS (ie dev)
      return false;
    }
  }

  // Convert this.cartItem values to Apple Pay lineItems
  applePayLineItems() {
    let lineItems = [];
    for(let item of this.cartItems) {
      lineItems.push({
        type: 'final',
        label: `${item.quantity}x ${item.name}`,
        amount: item.getTotal()
      });
    }
    return lineItems;
  }

  // Returns applePaymentRequest with our defaults
  applePayCreatePaymentRequest() {
    return this.applePayInstance.createPaymentRequest({
      // For now, Apple ignores the last two items
      requiredBillingContactFields: ['name', 'postalAddress', 'phone', 'email'],
      // Apple restricts phone and email to shippingContact (hopefully will extend to billingContact someday)
      requiredShippingContactFields: ['name', 'postalAddress', 'phone', 'email'],
      shippingMethods: [
        {
          label: 'Purchased for myself.',
          detail: 'Register under my name.',
          amount: '0.00',
          identifier: 'Email'
        },
        {
          label: 'This is a gift.',
          detail: 'Email to shipping contact.',
          amount: '0.00',
          identifier: 'Gift-Email'
        },
        {
          label: 'This is a gift',
          detail: 'Mail to shipping contact',
          amount: '0.00',
          identifier: 'Gift-Mail'
        },
        {
          label: 'This is a gift.',
          detail: 'Mail to me.',
          amount: '0.00',
          identifier: 'Gift-Mail'
        }
      ],
      lineItems: this.applePayLineItems(),
      total: {
        label: 'Schoolhouse Yoga',
        amount: this.getTotalCost()
      }
    });
  }

  // Map Apple Pay event data to our format so we can provide a confirmation
  applePayGetPurchaserAndRecipient(paymentEvent) {
    // Until Apple supports billingContact.phoneNumber and emailAddress, use values from shippingContact
    this.purchaser = {
      firstName: paymentEvent.billingContact.givenName,
      lastName: paymentEvent.billingContact.familyName,
      email: paymentEvent.billingContact.emailAddress || paymentEvent.shippingContact.emailAddress,
      phone: paymentEvent.billingContact.phoneNumber || paymentEvent.shippingContact.phoneNumber,
      address: paymentEvent.billingContact.addressLines[0],
      city: paymentEvent.billingContact.locality,
      state: paymentEvent.billingContact.administrativeArea,
      zipCode: paymentEvent.billingContact.postalCode
    };
    this.recipient = {
      firstName: paymentEvent.shippingContact.givenName,
      lastName: paymentEvent.shippingContact.familyName,
      email: paymentEvent.shippingContact.emailAddress,
      phone: paymentEvent.shippingContact.phoneNumber,
      address: paymentEvent.shippingContact.addressLines[0],
      city: paymentEvent.shippingContact.locality,
      state: paymentEvent.shippingContact.administrativeArea,
      zipCode: paymentEvent.shippingContact.postalCode
    };
  }

  // Take contents of cart and checkout with Apple Pay
  applePayCheckout() {
    // Compose the applePayRequest using our defaults
    const applePaymentRequest = this.applePayCreatePaymentRequest();

    // Then send the request
    const session = new window.ApplePaySession(1, applePaymentRequest);

    // Callback to handle merchant validation from Apple - https://developers.braintreepayments.com/guides/apple-pay/client-side/javascript/v3#onvalidatemerchant-callback
    session.onvalidatemerchant = event => {
      this.applePayInstance.performValidation({
        validationURL: event.validationURL,
        displayName: 'Schoolhouse Yoga, Inc.'
      })
        .then(merchantSession => {
          session.completeMerchantValidation(merchantSession);
        })
        .catch(err => {
          this.$log.error('Error validating Apple Pay merchant:', err);
          session.abort();
        });
    }; // session.onvalidatemerchant

    // Callback to handle selection of shipping method
    session.onshippingmethodselected = event => {
      this.gift = event.shippingMethod.identifier.startsWith('Gift');
      this.sendVia = event.shippingMethod.identifier.endsWith('Email') ? 'Email' : 'Mail';
      this.instructions = `${event.shippingMethod.label} ${event.shippingMethod.detail}`;
      // Not changing line items. Only using selection to set Cart properties.
      session.completeShippingMethodSelection(
        session.STATUS_SUCCESS,
        applePaymentRequest.total,
        applePaymentRequest.lineItems
      );
    };

    session.onpaymentauthorized = async event => {
      try {
        const payload = await this.applePayInstance.tokenize({ token: event.payment.token });
        session.completePayment(session.STATUS_SUCCESS);

        // Get this.purchaser and this.recipient from event.payment
        this.applePayGetPurchaserAndRecipient(event.payment);

        await this.postOrderInformation(payload);

        // To confirmation page (notify digest cycle)
        this.$timeout(() => this.$location.path('/confirmation'));
      } catch(err) {
        this.$log.error('Error tokenizing Apple Pay:', err);
        session.completePayment(session.STATUS_FAILURE);
      }
    }; // session.onpaymentauthorized

    // Show the payment sheet on the device
    session.begin();
  }

  // Immediate Apple Pay purchase with fallback to standard process
  applePayBuyItem(productID) {
    if(this.applePayEnabled) {
      // Set defaults to match initial shippingMethod (since it doensn't fire an event)
      this.gift = false;
      this.sendVia = 'Email';
      this.instructions = 'This purchase is for myself';

      // Only one cart item for Apple Pay purchases - suppress navigation to Cart page
      this.addItem(productID, true);

      // Complete the Apple Pay checkout process
      this.applePayCheckout();
    } else this.addItem(productID); // fallback to regular cart behavior with navigation to cart page
  }


  braintreeUpdateHostedFieldsState() {
    this.hostedFieldsState = this.hostedFieldsInstance.getState().fields;
    // Add isInvalid to simplify use of ng-messages
    this.hostedFieldsState.cvv.isInvalid = !this.hostedFieldsState.cvv.isValid;
    this.hostedFieldsState.expirationDate.isInvalid = !this.hostedFieldsState.expirationDate.isValid;
    this.hostedFieldsState.number.isInvalid = !this.hostedFieldsState.number.isValid;
    this.hostedFieldsState.isInvalid = this.hostedFieldsState.cvv.isInvalid || this.hostedFieldsState.number.isInvalid || this.hostedFieldsState.number.isInvalid;
  }

  braintreeHostedFieldsEventHandlers(eventNameArray) {
    for(let eventName of eventNameArray) {
      this.hostedFieldsInstance.on(eventName, event => {
        this.$timeout(() => {
          if(eventName === 'validityChange') {
            this.braintreeUpdateHostedFieldsState();
            return event;
          }
        });
      });
    }
  }

  // Called by placeOrder() from checkout and applePayCheckout()
  async postOrderInformation(payload) {
    // Order info to be submitted (subset of Cart properties)
    const orderInformation = {
      nonceFromClient: payload.nonce,
      purchaser: this.purchaser,
      recipient: this.gift ? this.recipient : this.purchaser,
      gift: this.gift || false,
      sendVia: this.sendVia,
      instructions: this.instructions,
      cartItems: this.cartItems // reference but it's being posted anyway
    };

    // Post order information and get response
    const { data } = await this.$http.post('/api/order', orderInformation);
    this.confirmation = data;

    // Make the data readable in local time zone
    const localTime = new Date(this.confirmation.createdAt);
    this.confirmation.createdAt = localTime.toLocaleString();

    // Clear the cart to avoid duplicate orders (only if successful though)
    this.clearCartItems();

    // Return confirmation to resolve the promise
    return this.confirmation;
  }

  // Return a promise to the orderConfirmation
  async placeOrder() {
    if(!this.hostedFieldsInstance) throw new Error('Hosted fields instance required to tokenize.');
    // Tokenize hosted fields to get nonce then post the order
    const payload = await this.hostedFieldsInstance.tokenize();
    this.confirmation = await this.postOrderInformation(payload);
  }

  // Iterates through array of products to retrieve one with matching id
  productLookupById(id) {
    return this.products.find(product => product._id === parseInt(id, 10));
  }

  // Clear the cartItems during checkout()
  clearCartItems() {
    this.initializeProperties();
    localStorage.removeItem(this.key);
  }

  // Add a product to the cart
  addItem(id, navigationDisabled) {
    this.confirmation = undefined;
    let inCart = this.getItemById(id);
    if(typeof inCart === 'object') { // then it is in the cart already
      // Increment the quantity instead of starting at 1
      inCart.quantity += 1;
    } else {
      let product = this.productLookupById(id);
      this.cartItems.push(new Item(id, product.name, product.price, 1));
    }
    this.saveToStorage();
    if(!navigationDisabled) this.$location.path('/checkout');
  }

  // Get item by its id
  getItemById(id) {
    for(let cartItem of this.cartItems) {
      if(cartItem.id == id) {
        return cartItem;
      }
    }
  }

  // Sum of quantities in the Cart, used by navbar badge and cart page header panel
  getTotalItems() {
    let count = 0;
    // Native way
    for(let cartItem of this.cartItems) {
      count += cartItem.quantity;
    }
    return count;
  }

  // Get the unique number of products in the Cart, not used yet
  getTotalUniqueItems() {
    return this.cartItems.length;
  }

  // Calculate the total cost of all items
  getTotalCost() {
    let total = 0;
    console.log(this.cartItems);
    for(let cartItem of this.cartItems) {
      total += cartItem.getTotal();
    }
    return parseFloat(total).toFixed(0);
  }

  // Remove CartItem by index used in cart.pug
  removeItem(index) {
    this.cartItems.splice(index, 1);
    this.saveToStorage();
  }

  // Remove CartItem by id, not used currently
  removeItemById(id) {
    for(let index in this.cartItems) {
      if(this.cartItems[index].id === id) {
        this.cartItems.splice(index, 1);
        break;
      }
    }
    this.saveToStorage();
  }

  // Used on checkout component to display empty cart message
  isEmpty() {
    return this.cartItems.length == 0;
  }

  // Load Cart from local storage during CartRun
  loadFromStorage() {
    let storedItems = false;
    let retrievedValue = this.$window.localStorage[this.key];
    if(retrievedValue) {
      storedItems = JSON.parse(retrievedValue);
    }
    if(typeof storedItems === 'object') {
      for(let item of storedItems) {
        this.cartItems.push(new Item(item.id, item.name, item.price, item.quantity));
      }
    }
  }

  // Save Cart to local storage
  saveToStorage() {
    let valueToStore = JSON.stringify(this.cartItems);
    this.$window.localStorage[this.key] = valueToStore;
  }
}
