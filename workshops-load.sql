SELECT workshop_upsert_json('
	{
		"title": "Moon Salutations with Kendell Romanelli",
    "photo": "/assets/images/workshops/moonsalutations.jpg",
    "imageId": null,
		"description": "Moon Salutations were developed in the early 1980s by four women at Kripalu Institute to balance the energy of traditional Sun Salutations. Moon Salutes tune into the reflective, intuitive energy of the moon focusing on hip and heart opening postures. Each posture is held for several seconds in order to allow the body to accept the energy of the practice. It is a mixed-level practice that builds stamina of the body and mind. This 90-minute workshop combines the beautiful flow of Moon Salutations with healing yoga exercises, chanting meditations, candle gazing and deep relaxation. The entire workshop is supported with live guitar music by Rick Romanelli. A perfect way to end your work week!",
		"sections": [
			{
				"title": "Full Moon",
				"starts": "2019-02-22T18:30-05:00",
				"ends": "2019-02-22T20:00-05:00",
				"productId": 23,
				"locationId": 2
			},
			{
				"title": "New Moon",
				"starts": "2019-03-08T18:30-05:00",
				"ends": "2019-03-08T20:00-05:00",
				"productId": 17,
				"locationId": 2
			},	
			{
				"title": "Full Moon",
				"starts": "2019-03-22T18:30-04:00",
				"ends": "2019-03-22T20:00-04:00",
				"productId": 18,
				"locationId": 2
			},	
			{
				"title": "New Moon",
				"starts": "2019-04-05T18:30-04:00",
				"ends": "2019-04-05T20:00-04:00",
				"productId": 19,
				"locationId": 2
			},	
			{
				"title": "Full Moon",
				"starts": "2019-04-19T18:30-04:00",
				"ends": "2019-04-19T20:00-04:00",
				"productId": 20,
				"locationId": 2
			},		
			{
				"title": "New Moon",
				"starts": "2019-05-03T18:30-04:00",
				"ends": "2019-05-03T20:00-04:00",
				"productId": 21,
				"locationId": 2
			},	
			{
				"title": "Full Moon",
				"starts": "2019-05-17T18:30-04:00",
				"ends": "2019-05-17T20:00-04:00",
				"productId": 27,
				"locationId": 2
			}
		]
  }'::json);
  
SELECT workshop_upsert_json('
	{
		"title": "Kundalini Yoga and Chant with Kendell Romanelli",
		"photo": "/assets/images/workshops/kundaliniandchant.jpg",
    "imageId": null,
		"description": "This beautiful workshop will focus on a Kundalini Yoga Kriya (a yoga exercise set) to open the body, mind and heart to the beauty within us and all around us. Kundalini Yoga involves moving yogic exercises and chanting meditations. It is appropriate for all levels of yoga and is renowned for it’s ability to inspire and heal practitioners. Class will be supported with live guitar music by Rick Romanelli. A great way to experience something new or embrace the beauty of Kundalini Yoga!",
		"sections": [
			{
				"starts": "2019-03-15T18:30-04:00",
				"ends": "2019-03-15T20:00-04:00",
				"productId": 54,
				"locationId": 2
			},
			{
				"starts": "2019-04-26T18:30-04:00",
				"ends": "2019-04-26T20:00-04:00",
				"productId": 55,
				"locationId": 2
			}
		]
    }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Sound Healing",
		"photo": "/assets/images/workshops/soundhealing.jpg",
		"description": "This healing workshop hosted by Kendell Romanelli & Rita Lampe, LCSW, is meant to calm the senses using movement, sound and scent. Class will begin with some breath work and a gentle yoga sequence to release the energy of the week and prepare the body & mind for meditation. We will then work with sound by chanting a mantra and close with a 30 minute relaxation supported by live guitar music, soft drumming & an optional essential oil blend.",
		"sections": [
			{
				"starts": "2019-03-29T18:30-04:00",
				"ends": "2019-03-29T20:00-04:00",
				"productId": 63,
				"locationId": 2
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"ends": "2019-04-28T15:30-04:00",
		"title": "Prenatal Partner Yoga Workshop with Brenda Maser",
		"photo": "/assets/images/workshops/prenatalpartner.jpg",
    "imageId": null,
		"description": "Moms-to-be bring your partner, a family member or a friend to this fun workshop where you will learn supportive partner poses, breath work, massage and relaxation techniques designed to help you connect with one another and prepare for the arrival of your little one! All stages of pregnancy and levels of experience are welcome. Price is per couple.",
		"sections": [
			{
				"starts": "2019-02-17T14:00-05:00",
				"ends": "2019-02-17T15:30-05:00",
				"productId": 14,
				"locationId": 3
			},
			{
				"starts": "2019-04-28T14:00-04:00",
				"ends": "2019-04-28T15:30-04:00",
				"productId": 13,
				"locationId": 3
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Restorative Yoga and Bedtime Stories with Zo",
		"photo": "/assets/images/workshops/restorative.jpg",
    "imageId": null,
		"description": "When I was a child, I loved snuggling into my bed at night while my father or mother read me a bedtime story. Their voices were soothing, gradually lulling me into a sleepy state. Often I fell asleep before the end of the fable. Join me this winter to rest, relax, and restore your body and mind in a variety of restorative yoga postures while listening to bedtime stories.  Caution: may lead to napping, snoring, and otherwise blissing out in yoga class . . . all of which is completely acceptable! Bring a journal if you''d like to record your thoughts and experiences.",
		"sections": [
			{
				"starts": "2019-03-03T15:00-05:00",
				"ends": "2019-03-03T16:30-05:00",
				"productId": 64,
				"locationId": 3
			},
			{
				"starts": "2019-04-14T15:00-04:00",
				"ends": "2019-04-14T16:30-04:00",
				"productId": 65,
				"locationId": 3
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Partner Meditation with Joni Sturgill",
		"photo": "/assets/images/workshops/partnermeditation.jpg",
    "imageId": null,
		"description": "Sustaining healthy, fulfilling relationships (of any kind) can be challenging, especially during times of stress. Do you need to reconnect with your spouse, partner, or close friend? Or maybe you''re just looking for something fun to do together to create a stronger bond? Learn to relax together and experience a deeper connection through breathwork and simple meditation techniques, as well as a few gentle partner yoga postures. This workshop is designed to allow you to quietly experience and appreciate each other''s unique presence.",
		"sections": [
			{
				"starts": "2019-02-16T15:00-05:00",
				"ends": "2019-02-16T16:30-05:00",
				"productId": 15,
				"locationId": 1
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Yoga for Lower Back Pain",
		"photo": "/assets/images/workshops/backpain.jpg",
    "imageId": null,
		"description": "It is estimated that 80% of Americans will experience an episode of low back pain in their lifetime.  In this workshop you can expect to learn about sources of pain, how to manage pain through yoga, and at home techniques to independently address fascial and other soft tissue restrictions.  Jamie DeMarco and Lori Wynn, both Doctors of Physical Therapy and yoga instructors, combined bring over 30 years of experience to offer in this course for compassion for the spine.  This workshop is appropriate for rehab professionals, yoga instructors and students.",
		"sections": [
			{
				"starts": "2019-02-23T14:00-05:00",
				"ends": "2019-02-23T16:00-05:00",
				"productId": 24,
				"locationId": 3
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Restorative Yoga and Lullabies with Zo and Kendell",
		"photo": "/assets/images/workshops/lullabies.jpg",
    "imageId": null,
		"description": "Restorative yoga is a quiet, still practice, suitable for beginners to advanced yoga students. Fully supported postures encourage the body to rest, relax, release away from uncomfortable holding patterns, and restore. Relaxation in the physical body encourages deeper, more relaxed and efficient breathing, which in turn promotes ease of mind. Restorative yoga does have challenges, too – relaxing isn''t always so easy, and letting go of our busy thoughts can be difficult. This is where the lullabies come in. Music is medicine: it stimulates the energy centers of the body, resonates all the cells in the body, and connects with the soul. Presenting a carefully curated set of lullabies, Kendell''s enchanting vocals, supported by Rick Romanelli on guitar, are sure to bring you deeper into your restorative practice.",
		"sections": [
			{
				"starts": "2019-03-01T18:30-05:00",
				"ends": "2019-03-01T20:00-05:00",
				"productId": 105,
				"locationId": 2
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Teaching Gentle and Restorative Yoga with Joni Sturgill",
		"photo": "/assets/images/workshops/teachinggentle.jpg",
    "imageId": null,
		"description": "Approximately 40 million adults suffer from anxiety in the United States. And these are just the ones who seek treatment. Learn how to calm and soothe your students'' nervous systems gently through simple relaxation practices and restorative yoga postures. You will learn how to teach gentle yoga movements appropriate for all populations and how to set up and adapt a handful of restorative yoga postures with and without props. Joni is an ERYT 500 and a YACEP; her workshop qualifies for continuing education credits with Yoga Alliance.",
		"sections": [
			{
				"starts": "2019-03-16T13:00-04:00",
				"ends": "2019-03-16T17:00-04:00",
				"productId": 103,
				"locationId": 2
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Mindful Mamas: A self-care workshop for New Moms with Kara Kernan",
		"photo": "/assets/images/workshops/mindfulmamas.jpg",
    "imageId": null,
		"description": "This workshop will be focused upon you, the new mom. For 90 minutes we will be our own village, creating a supportive, inclusive, and nurturing environment for you to let go and practice self-care. This will include a gentle, restorative practice that is appropriate for the new mom and their little one. Resources will be provided to assist you with developing a home practice that fits your lifestyle, and ways to incorporate your child(ren) into your practice will also be addressed. Particular consideration will be given to issues relating to motherhood such as prenatal and postnatal health, pelvic floor strengthening, and healing diastasis recti. You are welcome to attend this workshop with or without your little one(s). There is no additional fee if you choose to bring them, we just ask that they be no more than 3 years old. This workshop is LGBTQ+ friendly and open to all women (womxn) and non-binary parents.",
		"sections": [
			{
				"starts": "2019-03-31T15:00-04:00",
				"ends": "2019-03-31T16:30-04:00",
				"productId": 102,
				"locationId": 3
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Using Yoga Props to Develop your Practice and Insight with Richard Gartner",
		"photo": "/assets/images/workshops/richardprops.jpg",
    "imageId": null,
		"description": "How many ways can we use props? Richard Gartner''s Frameworks method includes nine ways to support, enhance and challenge students of all abilities. This workshop explores these techniques in-depth. Yoga teachers will discover new ways to use the props they have in their teaching environment. Everybody will find a reason to dust off the props they have around their house. The workshop includes two practices that highlight different techniques. We''ll make the most of whatever is available: straps, blocks, blankets, bolsters, or chairs. You''ll have plenty of opportunity to generate your own ideas alone and in groups, so you leave with a thorough understanding of the techniques. Everybody will receive a handout for future reference. You can sign up to receive a digital certificate of completion. Yoga Alliance members receive 6 hours of continuing education credit.",
		"sections": [
			{
				"starts": "2019-04-07T12:30-04:00",
				"ends": "2019-04-07T18:00-04:00",
				"productId": 26,
				"locationId": 3
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Living Your Purpose with Joni Sturgill",
		"photo": "/assets/images/workshops/selfcompassion.jpg",
    "imageId": null,
		"description": "Through journal prompts, powerful breathing practices, and movement, you''ll start to uncover your purpose as well as what''s holding you back from fulfilling it. Bring a journal and pen, be prepared for movement, mindfulness and writing exercises. Joni will help you craft your own home practice and coach you on how to stay committed to it, so that you can step back on your path, again and again. Joni Sturgill holds a master of science in counseling psychology and leads mindfulness trainings in schools, businesses, for small groups and more. Joni is also an ERYT 500 and a YACEP; her workshop qualifies for continuing education credits with Yoga Alliance.",
		"sections": [
			{
				"starts": "2019-04-07T13:00-04:00",
				"ends": "2019-04-07T15:00-04:00",
				"productId": 104,
				"locationId": 1
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Ashtanga Yoga Workshops with Lori Brungard",
		"photo": "/assets/images/workshops/loribrungard.jpg",
    "imageId": null,
		"description": "Lori Brungard, E-RYT 200, has been practicing yoga for 30 years. Since 1997, Lori has spent over a year in India studying with her teacher Sri K. Pattabhi Jois, and holds an Authorized Level II teaching certificate through KPJAYI. Her essay about practicing with Guruji appears in the book, Strength and Grace. She originally learned the many facets of yoga through a year long certification in Jivamukti Yoga with Sharon Gannon and David Life in 1999, and directed the Mysore Ashtanga program there from 2016-2018. Lori has been an Adjunct Lecturer at Hunter College in NYC since 2008, where she created a curriculum for an ongoing course in Ashtanga Yoga. In addition, she developed courses as resources for serious students and teachers for a 200 hour Ashtanga Sadhana Intensive, and as co-director of Ashtanga Yoga Shala from 2002-2007.",
		"sections": [
			{
				"title": "Sthira Sukham Asanam",
				"description": "Yoga Sutra II.46: What does a yoga assist do? It takes the existing sthira and sukha qualities in the student’s body and mind, and enhances them. This is done non-verbally, which can often be a more direct form of communication. The teacher must first establish these qualities in him/herself in order to transmit them to the student. Good adjustments start with a solid asana practice on the part of the teacher. The same qualities that create a good personal asana create a good assist. We will learn how to cultivate these qualities both individually and in relation to others, applying specific exercises directly to hands on assists in a variety of common poses.",
				"starts": "2019-04-26T14:00-04:00",
				"ends": "2019-04-26T16:00-04:00",
				"productId": 9,
				"locationId": 3
			},
			{
				"title": "Ashtanga Yantra",
				"description": "The standing poses are fundamental to all levels of Ashtanga practice. Each one relates to other poses that occur later on in the Primary Series in different orientations in space. By juxtaposing the similar poses, we can gain deeper insight into the underlying principles at work, and how to overcome the challenges of each asana, creating a multi-dimensional, kinesthetic experience of the meditative power of the yantra. The goal is detailed in Patanjali’s Yoga Sutras: involution toward the bindu, the central point of stillness.",
				"starts": "2019-04-26T18:00-04:00",
				"ends": "2019-04-26T20:00-04:00",
				"productId": 10,
				"locationId": 3
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Ayurveda 101 - Creating a Self-Care Routine with Abby Ritter",
		"photo": "/assets/images/workshops/ayurveda.jpg",
    "imageId": null,
		"description": "Curious about Ayuerveda?  Come join Ayurvedic Health Counselor Abby Ritter as she talk about the basics of Ayurveda.  Learn the importance of self-care and how to create a daily routine that is both supportive and nourishing to your body and mind. Included in the price of the workshop is an Ayurvedic self-care package.",
		"sections": [
			{
				"starts": "2019-04-27T12:00-04:00",
				"ends": "2019-04-27T14:00-04:00",
				"productId": 101,
				"locationId": 1
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Gather and Nourish: A Mother''s Practice with Stefanie Zito",
		"photo": "/assets/images/workshops/mothering.jpg",
    "imageId": null,
		"description": "Motherhood is a journey unlike any other. Each of our collective journeys take on a rich variety of forms, though similarly all require resilience, strength, adaptability, and courage. This nurturing practice is designed exclusively for moms. Moms on any part of their journey (including moms-to-be, moms whose children are grown, and moms whose kids require their constant attention) are warmly invited to pause, gather, and refresh. This rejuvenating and gentle practice will seek to collectively honor, celebrate, and restore as we connect to self and with one another.",
		"sections": [
			{
				"starts": "2019-05-10T18:30-04:00",
				"ends": "2019-05-10T20:30-04:00",
				"productId": 11,
				"locationId": 3
			}
		]
  }'::json);

SELECT workshop_upsert_json('
	{
		"title": "Mat to Marathon and Mat to Marathon with Stefanie Zito and Mandy Kull",
		"photo": "/assets/images/workshops/runners.jpg",
    "imageId": null,
		"description": "<b>Mat to Marathon</b>: Running is a uniquely invigorating movement for us as humans. The repetitive demands of this practice can, however, take a toll on the body. Yoga can offer incredible movement variety to cross train and compliment your running routine, particularly as you train for long distances. Join Mandy and Stefanie this marathon season for a blend of essential movement maintenance to supplement and sustain your running schedule. See how attention to breath, inventive uses of props, and strategic self-massage work can help you go the distance!<br><br><b>Marathon to Mat</b>: Whether you''re winding down from a relay, the half, the full, or simply your regular laps around the neighborhood, this practice will offer release and recovery. Designed with runners in mind, this recovery practice will focus on stretching, calming breath, and the ease of unnecessary tension in the body to promote longterm running health.",
		"sections": [
			{
				"title": "Mat to Marathon",
				"starts": "2019-04-06T14:00-04:00",
				"ends": "2019-04-06T16:00-04:00",
				"productId": 106,
				"locationId": 3
			},
			{
				"title": "Marathon to Mat",
				"starts": "2019-05-11T14:00-04:00",
				"ends": "2019-05-11T16:00-04:00",
				"productId": 107,
				"locationId": 3
			},
			{
				"title": "Both April 6th and May 11th sessions",
				"hideDate": true,
				"starts": "2019-05-11T14:00-04:00",
				"ends": "2019-05-11T16:00-04:00",
				"productId": 108,
				"locationId": 3
			}
		]
  }'::json);
