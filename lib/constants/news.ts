/**
 * Full Story Content Structure
 * Structured to aid display with sections, paragraphs, and formatting
 */
export interface FullStoryContent {
  introduction?: string; // Opening paragraph
  sections?: Array<{
    heading?: string; // Section heading
    paragraphs: string[]; // Array of paragraphs in this section
  }>;
  conclusion?: string; // Closing paragraph
}

/**
 * Unified News Item Type
 * This type represents all news items across different sections.
 * Items are marked with flags (isFeatured, isTrending, isLatest) to indicate
 * which sections they belong to. The presence of videoUrl indicates a video story.
 */
export interface NewsItem {
  id: number;
  title: string;
  excerpt?: string; // Optional - not all items need excerpts (e.g., video items)
  category: string;
  image: string;
  readTime: string;
  views: string;
  comments?: number; // Optional - not all items need comments (e.g., trending items)
  likes?: number;
  videoUrl?: string; // Presence indicates video story
  duration?: string; // For video items
  rank?: number; // For trending items
  isFeatured?: boolean; // Mark for featured section
  isTrending?: boolean; // Mark for trending section
  isLatest?: boolean; // Mark for latest/news feed section
  author?: string; // Author name
  date?: string; // Publication date (ISO format or readable format)
  fullStory?: FullStoryContent; // Structured full story content
}

/**
 * Central array of all news items
 * Items can appear in multiple sections by setting multiple flags
 */
export const NEWS_ITEMS: NewsItem[] = [
  // Featured Stories
  {
    id: 1,
    title: 'Gospel Artist Wins International Music Award',
    excerpt:
      'Celebrating the achievement of a renowned gospel artist who brought home a prestigious international award, inspiring millions worldwide.',
    category: 'Christian Celebrity News',
    image: '/images/video-thumb-1.jpg',
    readTime: '5 min read',
    views: '12.5K',
    comments: 89,
    videoUrl: 'https://example.com/videos/gospel-award.mp4',
    isFeatured: true,
    isLatest: true,
    author: 'Sarah Johnson',
    date: '2025-01-20',
    fullStory: {
      introduction:
        'In a momentous occasion that has captured the hearts of millions, renowned gospel artist Marcus Thompson has been honored with the prestigious International Gospel Music Award, marking a significant milestone in his illustrious career.',
      sections: [
        {
          heading: 'A Journey of Faith and Music',
          paragraphs: [
            "Marcus Thompson's journey in gospel music spans over two decades, during which he has consistently delivered messages of hope, faith, and redemption through his powerful vocals and heartfelt lyrics. His music has transcended cultural boundaries, reaching audiences across continents.",
            "The award ceremony, held in Nashville, Tennessee, brought together gospel music luminaries from around the world. Thompson's acceptance speech was a moving testament to his faith, thanking God, his family, and the global community of gospel music lovers who have supported his ministry.",
          ],
        },
        {
          heading: 'Impact on the Gospel Music Community',
          paragraphs: [
            "This recognition not only celebrates Thompson's individual achievement but also highlights the growing influence of gospel music on the global stage. His win represents a triumph for the entire gospel music community, demonstrating that faith-based music continues to resonate with diverse audiences.",
            "Industry experts have praised Thompson's ability to blend traditional gospel sounds with contemporary elements, creating a unique style that appeals to both longtime gospel enthusiasts and new listeners discovering the genre.",
          ],
        },
      ],
      conclusion:
        'As Marcus Thompson continues to inspire millions through his music, this award serves as a reminder of the power of faith, perseverance, and the universal language of worship. His achievement encourages aspiring gospel artists worldwide to pursue their calling with dedication and passion.',
    },
  },
  {
    id: 2,
    title: 'New Church Building Dedication Ceremony Announced',
    excerpt:
      'Join us for the grand opening and dedication of our new worship center this coming Sunday.',
    category: 'Church & Ministry Announcements',
    image: '/images/video-thumb-2.jpg',
    readTime: '3 min read',
    views: '8.2K',
    comments: 45,
    isFeatured: true,
    isLatest: true,
    author: 'Pastor Michael Williams',
    date: '2025-01-22',
    fullStory: {
      introduction:
        'We are thrilled to announce the grand opening and dedication ceremony of our new worship center, a milestone that represents years of prayer, planning, and faithful stewardship.',
      sections: [
        {
          heading: 'Ceremony Details',
          paragraphs: [
            'The dedication ceremony will take place this coming Sunday, January 26th, at 10:00 AM. The service will include special worship, a message from our senior pastor, and a ribbon-cutting ceremony followed by a community reception.',
            'All members of our congregation and the wider community are warmly invited to join us for this historic occasion. The new facility features state-of-the-art audio-visual equipment, expanded seating capacity, and enhanced accessibility features.',
          ],
        },
        {
          heading: 'A Vision Realized',
          paragraphs: [
            'This new building represents the culmination of a vision that began five years ago when our congregation recognized the need for expanded space to accommodate our growing community. Through faithful giving and dedicated volunteers, we have seen this dream become a reality.',
            "The facility includes not only the main sanctuary but also dedicated spaces for children's ministry, youth programs, community outreach, and fellowship gatherings. Each space has been thoughtfully designed to serve our mission of spreading the Gospel and building community.",
          ],
        },
      ],
      conclusion:
        'We look forward to seeing how God will use this new space to further His kingdom and bless our community. Your presence at the dedication ceremony would be a great encouragement to our church family as we celebrate this significant milestone together.',
    },
  },
  {
    id: 3,
    title: 'From Addiction to Ministry: A Powerful Testimony',
    excerpt:
      'A moving story of transformation and redemption that shows the power of faith and community support.',
    category: 'Inspirational Stories',
    image: '/images/video-thumb-3.jpg',
    readTime: '6 min read',
    views: '15.1K',
    comments: 112,
    videoUrl: 'https://example.com/videos/testimony.mp4',
    isFeatured: true,
    isLatest: true,
    author: 'David Martinez',
    date: '2025-01-18',
    fullStory: {
      introduction:
        "In a powerful testimony of God's transforming grace, James Anderson shares his journey from the depths of addiction to a life dedicated to ministry, proving that no one is beyond redemption.",
      sections: [
        {
          heading: 'The Darkest Days',
          paragraphs: [
            'James Anderson\'s story begins in the shadows of addiction, where he spent over a decade struggling with substance abuse. "I had lost everything," he recalls. "My family, my job, my dignity - all gone. I was living on the streets, consumed by my addiction, with no hope for the future."',
            'At his lowest point, James found himself in a rehabilitation center, not by choice but as a last resort. It was there that he encountered a chaplain who would change the course of his life forever. "He didn\'t judge me or lecture me," James remembers. "He simply showed me love and introduced me to Jesus."',
          ],
        },
        {
          heading: 'The Transformation',
          paragraphs: [
            'Through prayer, Bible study, and the support of a faith community, James began to experience a transformation that went beyond physical recovery. "It wasn\'t just about getting clean," he explains. "It was about finding my identity in Christ and discovering the purpose God had for my life."',
            'After completing his rehabilitation program, James felt called to ministry. He enrolled in seminary, earned his degree, and now serves as a chaplain at the very rehabilitation center where his journey began. "I want to be for others what that chaplain was for me," he says with conviction.',
          ],
        },
        {
          heading: 'A Message of Hope',
          paragraphs: [
            "James's ministry has touched hundreds of lives, as he shares his testimony with those who are where he once was. His story serves as a powerful reminder that God specializes in turning our greatest failures into our greatest testimonies.",
            '"If God can transform my life, He can transform anyone\'s," James declares. "There is no pit too deep, no addiction too strong, no situation too hopeless for God\'s redeeming love."',
          ],
        },
      ],
      conclusion:
        'James Anderson\'s story continues to inspire and give hope to those struggling with addiction. His testimony is a living example of 2 Corinthians 5:17: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!"',
    },
  },
  {
    id: 4,
    title: 'Full Scholarship Available for Theology Students',
    excerpt:
      'Apply now for fully-funded theology scholarships at leading Christian universities worldwide.',
    category: 'Scholarship Alerts',
    image: '/images/album-1.jpg',
    readTime: '4 min read',
    views: '9.8K',
    comments: 67,
    isFeatured: true,
    isLatest: true,
    author: 'Dr. Elizabeth Thompson',
    date: '2025-01-19',
    fullStory: {
      introduction:
        'Exceptional opportunities await theology students as leading Christian universities announce fully-funded scholarship programs for the upcoming academic year.',
      sections: [
        {
          heading: 'Available Scholarships',
          paragraphs: [
            'Multiple prestigious Christian universities are offering comprehensive scholarship packages that cover tuition, room and board, and living expenses. These programs are specifically designed to support students called to ministry and theological education.',
            'The scholarships are available for undergraduate, graduate, and doctoral programs in theology, biblical studies, Christian ministry, and related fields. Applications are being accepted now through March 15th.',
          ],
        },
        {
          heading: 'Eligibility and Application',
          paragraphs: [
            'To be eligible, applicants must demonstrate a strong commitment to Christian ministry, maintain excellent academic standing, and provide letters of recommendation from church leaders or mentors. The selection process considers both academic excellence and ministry potential.',
            "Interested students should visit the universities' websites to access application forms and detailed requirements. Early application is strongly encouraged as these scholarships are highly competitive.",
          ],
        },
      ],
      conclusion:
        "These scholarship opportunities represent a significant investment in the future of Christian ministry. We encourage all eligible students to prayerfully consider applying and to seek God's guidance in this important decision.",
    },
  },
  {
    id: 5,
    title: 'NGO Seeking Program Coordinator for Youth Ministry',
    excerpt:
      'Join our team in making a difference. We are hiring a passionate coordinator for our youth programs.',
    category: 'Jobs (NGO / Faith-based)',
    image: '/images/album-2.jpg',
    readTime: '5 min read',
    views: '11.3K',
    comments: 89,
    isFeatured: true,
    isLatest: true,
    author: 'Jennifer Adams',
    date: '2025-01-21',
    fullStory: {
      introduction:
        'Our faith-based non-profit organization is seeking a dedicated Program Coordinator to lead and expand our youth ministry initiatives, making a lasting impact on young lives.',
      sections: [
        {
          heading: 'Position Overview',
          paragraphs: [
            'The Program Coordinator will be responsible for developing, implementing, and overseeing youth programs that engage young people in faith-based activities, community service, and personal development. This role requires creativity, leadership, and a genuine passion for youth ministry.',
            'Key responsibilities include organizing weekly youth meetings, planning special events and retreats, mentoring program participants, coordinating with volunteers, and building relationships with local churches and community organizations.',
          ],
        },
        {
          heading: 'Qualifications and Benefits',
          paragraphs: [
            "The ideal candidate will have a bachelor's degree in ministry, education, or a related field, along with at least two years of experience in youth ministry or program coordination. Strong communication skills, organizational abilities, and a heart for serving young people are essential.",
            'We offer a competitive salary, comprehensive benefits package, professional development opportunities, and the chance to be part of a mission-driven team that is transforming lives through faith-based programs.',
          ],
        },
      ],
      conclusion:
        'If you feel called to make a difference in the lives of young people and are passionate about youth ministry, we encourage you to apply. This position offers the opportunity to be part of something meaningful and to see God work through your efforts.',
    },
  },
  {
    id: 6,
    title: 'Review: "The Chosen" Season 4 - A Masterpiece',
    excerpt:
      'An in-depth review of the latest season of this groundbreaking Christian series that has captivated audiences globally.',
    category: 'Christian Movie Reviews',
    image: '/images/album-3.jpg',
    readTime: '7 min read',
    views: '14.2K',
    comments: 134,
    videoUrl: 'https://example.com/videos/chosen-review.mp4',
    isFeatured: true,
    isLatest: true,
    author: 'Michael Chen',
    date: '2025-01-17',
    fullStory: {
      introduction:
        '"The Chosen" Season 4 continues to set new standards for faith-based storytelling, delivering powerful narratives that bring the Gospel accounts to life with unprecedented depth and authenticity.',
      sections: [
        {
          heading: 'Storytelling Excellence',
          paragraphs: [
            'Season 4 of "The Chosen" masterfully weaves together the familiar Gospel narratives with rich character development and historical context. The series continues to excel in its humanization of biblical figures, making their struggles, doubts, and triumphs relatable to modern audiences.',
            'The production quality remains exceptional, with stunning cinematography, authentic period details, and performances that capture both the humanity and divinity of Jesus and His disciples. Each episode builds upon the previous ones, creating a cohesive narrative arc that deepens our understanding of the Gospel story.',
          ],
        },
        {
          heading: 'Spiritual Impact',
          paragraphs: [
            'What sets "The Chosen" apart is its ability to make viewers feel as if they are experiencing the events of the Gospels firsthand. The series has sparked renewed interest in Scripture study and has become a powerful tool for evangelism and discipleship.',
            "Many viewers report that the series has deepened their faith, helped them understand biblical events in new ways, and inspired them to read the Gospels with fresh eyes. The show's success demonstrates the hunger for quality faith-based content that honors both artistic excellence and biblical truth.",
          ],
        },
      ],
      conclusion:
        '"The Chosen" Season 4 is not just entertainment; it\'s a ministry tool that has the power to transform hearts and minds. This season continues the series\' tradition of excellence and is a must-watch for anyone seeking to experience the Gospel story in a fresh, compelling way.',
    },
  },
  {
    id: 7,
    title: 'Pastor Shares Journey of Faith on National TV',
    excerpt:
      'A prominent pastor shares his inspiring journey and message of hope on a major television network.',
    category: 'Christian Celebrity News',
    image: '/images/artist-1.jpg',
    readTime: '4 min read',
    views: '7.8K',
    comments: 56,
    videoUrl: 'https://example.com/videos/pastor-interview.mp4',
    isFeatured: true,
    isLatest: true,
    author: 'Rachel Green',
    date: '2025-01-16',
    fullStory: {
      introduction:
        'Pastor Robert Mitchell made a powerful appearance on national television this week, sharing his remarkable journey of faith and delivering a message of hope that resonated with millions of viewers.',
      sections: [
        {
          heading: 'A Compelling Testimony',
          paragraphs: [
            "During the hour-long interview, Pastor Mitchell opened up about his transformation from a troubled youth to a respected church leader. He shared how faith changed his life's trajectory and how he now dedicates his ministry to helping others find the same hope and purpose.",
            'The interview covered topics ranging from his personal struggles to his vision for the church, his thoughts on current social issues from a biblical perspective, and practical advice for those seeking to grow in their faith. His authenticity and wisdom captivated the audience.',
          ],
        },
        {
          heading: 'National Impact',
          paragraphs: [
            'The appearance generated significant positive response, with thousands of viewers reaching out to express how the message touched their lives. Social media was abuzz with discussions about faith, hope, and the power of transformation.',
            'Many viewers who had never attended church expressed interest in learning more about Christianity after watching the interview. The segment demonstrated the power of sharing faith stories in mainstream media and the hunger for authentic spiritual content.',
          ],
        },
      ],
      conclusion:
        "Pastor Mitchell's appearance serves as a reminder that faith stories have a place in public discourse and can inspire positive change. His willingness to share his journey openly has opened doors for meaningful conversations about faith, hope, and redemption.",
    },
  },
  {
    id: 8,
    title: 'Annual Church Conference Registration Now Open',
    excerpt:
      'Register early for our annual conference featuring renowned speakers, worship sessions, and networking opportunities.',
    category: 'Church & Ministry Announcements',
    image: '/images/artist-2.jpg',
    readTime: '6 min read',
    views: '13.1K',
    comments: 108,
    isFeatured: true,
    isLatest: true,
    author: 'Pastor Michael Williams',
    date: '2025-01-23',
    fullStory: {
      introduction:
        'Registration is now open for our annual church conference, a three-day event that brings together believers from across the region for worship, teaching, and fellowship.',
      sections: [
        {
          heading: 'Conference Highlights',
          paragraphs: [
            "This year's conference features an impressive lineup of speakers, including renowned theologians, ministry leaders, and worship artists. The program includes main sessions, breakout workshops, and special sessions for youth, children, and families.",
            'Attendees can expect powerful worship experiences, practical teaching sessions, opportunities for prayer and ministry, and networking with other believers. The conference theme, "Building Together in Faith," emphasizes unity, growth, and community impact.',
          ],
        },
        {
          heading: 'Registration and Details',
          paragraphs: [
            'Early bird registration is available until February 15th at a discounted rate. Group discounts are also available for churches registering multiple attendees. The conference will be held at the convention center from March 20-22, 2025.',
            'Registration includes access to all sessions, conference materials, and meals. Accommodation packages are available for out-of-town attendees. Childcare will be provided for families with young children.',
          ],
        },
      ],
      conclusion:
        'We encourage all members of our church family and the wider Christian community to join us for this transformative event. Early registration ensures your spot and helps us plan effectively for what promises to be an inspiring and impactful conference.',
    },
  },
  {
    id: 9,
    title: 'Miracle Healing: A Story of Faith and Recovery',
    excerpt:
      'A powerful testimony of healing that has touched the hearts of many and strengthened the faith of our community.',
    category: 'Inspirational Stories',
    image: '/images/artist-3.jpg',
    readTime: '5 min read',
    views: '10.4K',
    comments: 78,
    isFeatured: true,
    isLatest: true,
    author: 'Amanda Foster',
    date: '2025-01-15',
    fullStory: {
      introduction:
        'In a testimony that has strengthened the faith of our entire community, Maria Rodriguez shares her miraculous journey of healing from a life-threatening illness through prayer and unwavering faith.',
      sections: [
        {
          heading: 'The Diagnosis',
          paragraphs: [
            "When Maria Rodriguez received a devastating diagnosis from her doctors, the prognosis was grim. Medical professionals gave her little hope, and her family prepared for the worst. But Maria refused to give up, turning to prayer and trusting in God's healing power.",
            '"I knew that God was bigger than any diagnosis," Maria recalls. "I surrounded myself with prayer warriors from my church, and we began praying fervently for healing. I also continued with medical treatment, trusting that God could work through the doctors as well."',
          ],
        },
        {
          heading: 'The Miracle',
          paragraphs: [
            "After months of prayer and treatment, Maria's follow-up scans revealed something remarkable: the disease had completely disappeared. Her doctors were astonished, calling it medically inexplicable. For Maria and her faith community, it was a clear answer to prayer.",
            '"This wasn\'t just a medical recovery," Maria explains. "It was a spiritual transformation. Through this experience, I learned to trust God completely, and my faith became unshakeable. I now see every day as a gift and an opportunity to serve God."',
          ],
        },
      ],
      conclusion:
        "Maria's story has become a beacon of hope for others facing health challenges. Her testimony reminds us that while we don't always understand God's ways, we can always trust in His love and power. Her healing has strengthened the faith of many and serves as a powerful reminder of God's miraculous work in our lives.",
    },
  },
  {
    id: 10,
    title: 'International Christian University Offers Full Scholarships',
    excerpt:
      'Leading Christian universities are offering fully-funded programs for students from developing countries.',
    category: 'Scholarship Alerts',
    image: '/images/video-thumb-1.jpg',
    readTime: '5 min read',
    views: '12.3K',
    comments: 89,
    isFeatured: true,
    isLatest: true,
    author: 'Dr. Elizabeth Thompson',
    date: '2025-01-20',
    fullStory: {
      introduction:
        'In a significant initiative to support global Christian education, several international Christian universities have announced comprehensive scholarship programs specifically designed for students from developing nations.',
      sections: [
        {
          heading: 'Scholarship Opportunities',
          paragraphs: [
            'These programs cover full tuition, accommodation, meals, and living expenses, making it possible for students who would otherwise be unable to afford higher education to pursue their academic and ministry goals. The scholarships are available for undergraduate and graduate programs in theology, ministry, education, and related fields.',
            'The universities participating in this initiative are committed to training the next generation of Christian leaders from around the world. They recognize the importance of providing educational opportunities to students from diverse backgrounds and economic circumstances.',
          ],
        },
        {
          heading: 'Application Process',
          paragraphs: [
            'Students interested in applying must demonstrate academic excellence, a clear calling to Christian ministry, and financial need. The application process includes submitting academic transcripts, letters of recommendation, a personal statement, and evidence of ministry involvement.',
            'Applications are being accepted through the end of February, with decisions to be announced by April. Selected students will begin their programs in the fall semester, with full support throughout their academic journey.',
          ],
        },
      ],
      conclusion:
        'These scholarship programs represent a significant investment in the future of global Christian ministry. They provide opportunities for students who are called to serve but lack the financial resources to pursue their education. We encourage all eligible students to prayerfully consider applying.',
    },
  },
  {
    id: 11,
    title: 'Mission Organization Hiring Field Workers',
    excerpt:
      'Join our mission team in serving communities around the world. Multiple positions available for passionate individuals.',
    category: 'Jobs (NGO / Faith-based)',
    image: '/images/video-thumb-2.jpg',
    readTime: '6 min read',
    views: '9.4K',
    comments: 67,
    isFeatured: true,
    isLatest: true,
    author: 'Jennifer Adams',
    date: '2025-01-22',
    fullStory: {
      introduction:
        'Our international mission organization is expanding its field operations and is seeking dedicated individuals to join our team in serving communities around the world through faith-based initiatives.',
      sections: [
        {
          heading: 'Available Positions',
          paragraphs: [
            'We are hiring for multiple positions including community development coordinators, education specialists, healthcare workers, and ministry leaders. These roles involve working directly with local communities to provide practical assistance while sharing the love of Christ.',
            'Field workers will be assigned to various locations based on their skills, experience, and calling. Assignments typically last 2-3 years, with opportunities for extension. All positions include comprehensive training, ongoing support, and competitive compensation packages.',
          ],
        },
        {
          heading: 'Requirements and Benefits',
          paragraphs: [
            'Ideal candidates will have a strong Christian faith, relevant education or experience, cross-cultural sensitivity, and a heart for serving others. Language skills and previous mission experience are advantageous but not always required, as training will be provided.',
            'Benefits include salary, housing, health insurance, travel expenses, professional development opportunities, and the chance to make a lasting impact in communities around the world. We also provide spiritual support and mentorship to help workers thrive in their assignments.',
          ],
        },
      ],
      conclusion:
        "If you feel called to serve in missions and are passionate about making a difference in the lives of others, we encourage you to apply. This is an opportunity to use your gifts and talents to advance God's kingdom while growing personally and professionally.",
    },
  },
  {
    id: 12,
    title: 'Review: "I Can Only Imagine" - A Must-Watch',
    excerpt:
      'An emotional and inspiring film that tells the true story behind one of the most beloved Christian songs.',
    category: 'Christian Movie Reviews',
    image: '/images/video-thumb-3.jpg',
    readTime: '6 min read',
    views: '13.5K',
    comments: 145,
    videoUrl: 'https://example.com/videos/i-can-only-imagine-review.mp4',
    isFeatured: true,
    isLatest: true,
    author: 'Michael Chen',
    date: '2025-01-14',
    fullStory: {
      introduction:
        '"I Can Only Imagine" is a powerful biographical film that tells the inspiring true story of Bart Millard, lead singer of the Christian band MercyMe, and the journey that led to the creation of one of the most beloved songs in contemporary Christian music.',
      sections: [
        {
          heading: 'A Story of Redemption',
          paragraphs: [
            "The film beautifully portrays Bart's difficult relationship with his father and how God used that pain to create something beautiful. The story is one of forgiveness, redemption, and the power of God to transform broken relationships. The performances are heartfelt and authentic, making the emotional journey deeply moving.",
            'What makes this film particularly powerful is its honesty about pain and struggle, while never losing sight of hope and redemption. It shows that God can use our deepest hurts to create something that ministers to millions of people.',
          ],
        },
        {
          heading: 'Impact and Message',
          paragraphs: [
            'The film has resonated with audiences worldwide, many of whom have been moved to tears by its message of forgiveness and hope. It serves as a powerful reminder that our stories, even the painful parts, can be used by God for His glory.',
            '"I Can Only Imagine" is more than just a movie about a song; it\'s a testament to God\'s faithfulness, the power of forgiveness, and the hope we have in Christ. The film encourages viewers to examine their own relationships and to trust God with their pain.',
          ],
        },
      ],
      conclusion:
        "This film is a must-watch for anyone who appreciates powerful storytelling, authentic faith narratives, and stories of redemption. It's a reminder that God can take our brokenness and turn it into something beautiful that blesses others. Highly recommended for families, small groups, and anyone seeking inspiration.",
    },
  },

  // Latest/News Feed Items (additional items not in featured)
  {
    id: 13,
    title: 'Gospel Singer Announces New Album Release',
    excerpt:
      'One of the most beloved gospel artists has announced their highly anticipated new album, set to release next month.',
    category: 'Christian Celebrity News',
    image: '/images/album-1.jpg',
    readTime: '4 min',
    views: '5.2K',
    comments: 34,
    likes: 128,
    isLatest: true,
    author: 'Sarah Johnson',
    date: '2025-01-24',
    fullStory: {
      introduction:
        'Gospel music sensation Victoria Grace has officially announced the release of her highly anticipated new album, "Songs of Hope," scheduled to debut next month.',
      sections: [
        {
          heading: 'Album Details',
          paragraphs: [
            'The new album features 12 original tracks that blend contemporary gospel sounds with traditional hymns, creating a unique worship experience. Victoria has described this project as her most personal work to date, drawing from her own journey of faith and the testimonies of others.',
            "Fans can expect powerful ballads, uplifting anthems, and intimate worship songs that reflect Victoria's growth as both an artist and a person of faith. The album includes collaborations with several renowned gospel artists and worship leaders.",
          ],
        },
        {
          heading: 'Pre-Release Excitement',
          paragraphs: [
            "The announcement has generated significant excitement in the gospel music community, with pre-orders already breaking records. Victoria's previous albums have consistently topped Christian music charts and have been used in churches and worship services worldwide.",
            'A special release event is planned at a major venue, where Victoria will perform songs from the new album and share the stories behind them. The event will also be streamed live for fans unable to attend in person.',
          ],
        },
      ],
      conclusion:
        "Victoria Grace's new album promises to be a powerful addition to the gospel music landscape, offering songs that will inspire, encourage, and lead listeners into deeper worship. We eagerly anticipate its release and the impact it will have on the Christian music community.",
    },
  },
  {
    id: 14,
    title: 'Pastor Shares Journey of Faith on National TV',
    excerpt:
      'A prominent pastor shares his inspiring journey and message of hope on a major television network.',
    category: 'Christian Celebrity News',
    image: '/images/album-2.jpg',
    readTime: '3 min',
    views: '9.8K',
    comments: 67,
    likes: 245,
    videoUrl: 'https://example.com/videos/pastor-interview.mp4',
    isLatest: true,
    author: 'Rachel Green',
    date: '2025-01-23',
    fullStory: {
      introduction:
        'Pastor Robert Mitchell made a powerful appearance on national television, sharing his inspiring journey and delivering a message of hope that reached millions of viewers across the country.',
      sections: [
        {
          heading: 'The Interview',
          paragraphs: [
            "During the prime-time interview, Pastor Mitchell discussed his transformation from a troubled past to becoming a respected church leader. He shared how faith changed his life's direction and how he now dedicates his ministry to helping others find the same hope and purpose.",
            'The conversation covered a wide range of topics, including his thoughts on current social issues from a biblical perspective, practical advice for those seeking to grow in their faith, and his vision for the future of the church. His authenticity and wisdom resonated with viewers.',
          ],
        },
        {
          heading: 'Viewer Response',
          paragraphs: [
            'The appearance generated an overwhelmingly positive response, with thousands of viewers reaching out to express how the message impacted their lives. Social media platforms were filled with discussions about faith, hope, and the power of transformation.',
            'Many viewers who had never attended church expressed interest in learning more about Christianity after watching the interview. The segment demonstrated the power of sharing faith stories in mainstream media.',
          ],
        },
      ],
      conclusion:
        "Pastor Mitchell's appearance serves as a reminder that faith stories have a place in public discourse and can inspire positive change. His willingness to share his journey openly has opened doors for meaningful conversations about faith, hope, and redemption.",
    },
  },
  {
    id: 15,
    title: 'Annual Church Conference Registration Now Open',
    excerpt:
      'Register early for our annual conference featuring renowned speakers, worship sessions, and networking opportunities.',
    category: 'Church & Ministry Announcements',
    image: '/images/album-3.jpg',
    readTime: '6 min',
    views: '11.3K',
    comments: 89,
    likes: 312,
    isLatest: true,
    author: 'Pastor Michael Williams',
    date: '2025-01-25',
    fullStory: {
      introduction:
        'Registration is now open for our annual church conference, a transformative three-day event that brings together believers from across the region for worship, teaching, and fellowship.',
      sections: [
        {
          heading: 'What to Expect',
          paragraphs: [
            "This year's conference features an impressive lineup of speakers, including renowned theologians, ministry leaders, and worship artists. The program includes main sessions, breakout workshops covering various topics, and special sessions designed for youth, children, and families.",
            'Attendees can expect powerful worship experiences led by gifted musicians, practical teaching sessions that apply biblical principles to everyday life, opportunities for prayer and ministry, and valuable networking with other believers from different churches and backgrounds.',
          ],
        },
        {
          heading: 'Registration Information',
          paragraphs: [
            'Early bird registration is available until February 15th at a discounted rate. Group discounts are also available for churches registering multiple attendees. The conference will be held at the convention center from March 20-22, 2025.',
            'Registration includes access to all sessions, conference materials, and meals. Accommodation packages are available for out-of-town attendees, and childcare will be provided for families with young children.',
          ],
        },
      ],
      conclusion:
        'We encourage all members of our church family and the wider Christian community to join us for this transformative event. Early registration ensures your spot and helps us plan effectively for what promises to be an inspiring and impactful conference.',
    },
  },
  {
    id: 16,
    title: 'New Youth Ministry Program Launching This Fall',
    excerpt:
      'Exciting new programs for youth including Bible study, mentorship, and community service initiatives.',
    category: 'Church & Ministry Announcements',
    image: '/images/artist-1.jpg',
    readTime: '5 min',
    views: '7.1K',
    comments: 56,
    likes: 189,
    isLatest: true,
    author: 'Pastor Michael Williams',
    date: '2025-01-24',
    fullStory: {
      introduction:
        'We are excited to announce the launch of our new comprehensive youth ministry program this fall, designed to engage, equip, and empower the next generation of believers.',
      sections: [
        {
          heading: 'Program Components',
          paragraphs: [
            "The new program includes weekly Bible study sessions that make Scripture relevant to young people's lives, one-on-one mentorship opportunities with mature believers, and regular community service projects that allow youth to put their faith into action.",
            'Additional components include monthly social events, leadership development workshops, mission trip opportunities, and special retreats designed to deepen relationships with God and with each other. The program is structured to accommodate both middle school and high school students.',
          ],
        },
        {
          heading: 'Goals and Vision',
          paragraphs: [
            'Our vision is to create a safe, welcoming environment where young people can explore their faith, ask tough questions, and grow in their relationship with Christ. We aim to equip them with a solid biblical foundation that will guide them through their teenage years and beyond.',
            'The program emphasizes authentic community, practical application of faith, and the development of leadership skills. We believe that when young people are properly equipped and encouraged, they can make a significant impact in their schools, communities, and the world.',
          ],
        },
      ],
      conclusion:
        'We invite all youth and their parents to learn more about this exciting new program. Information sessions will be held in the coming weeks, and we encourage families to get involved. This is an investment in the future of our church and the next generation of Christian leaders.',
    },
  },
  {
    id: 17,
    title: 'Miracle Healing: A Story of Faith and Recovery',
    excerpt:
      'A powerful testimony of healing that has touched the hearts of many and strengthened the faith of our community.',
    category: 'Inspirational Stories',
    image: '/images/artist-2.jpg',
    readTime: '7 min',
    views: '14.2K',
    comments: 134,
    likes: 421,
    isLatest: true,
    author: 'Amanda Foster',
    date: '2025-01-19',
    fullStory: {
      introduction:
        'In a testimony that has strengthened the faith of our entire community, Maria Rodriguez shares her miraculous journey of healing from a life-threatening illness through prayer and unwavering faith.',
      sections: [
        {
          heading: 'The Challenge',
          paragraphs: [
            "When Maria Rodriguez received a devastating diagnosis from her doctors, the prognosis was grim. Medical professionals gave her little hope, and her family prepared for the worst. But Maria refused to give up, turning to prayer and trusting in God's healing power.",
            '"I knew that God was bigger than any diagnosis," Maria recalls. "I surrounded myself with prayer warriors from my church, and we began praying fervently for healing. I also continued with medical treatment, trusting that God could work through the doctors as well."',
          ],
        },
        {
          heading: 'The Miracle Unfolds',
          paragraphs: [
            "After months of prayer and treatment, Maria's follow-up scans revealed something remarkable: the disease had completely disappeared. Her doctors were astonished, calling it medically inexplicable. For Maria and her faith community, it was a clear answer to prayer.",
            '"This wasn\'t just a medical recovery," Maria explains. "It was a spiritual transformation. Through this experience, I learned to trust God completely, and my faith became unshakeable. I now see every day as a gift and an opportunity to serve God."',
          ],
        },
      ],
      conclusion:
        "Maria's story has become a beacon of hope for others facing health challenges. Her testimony reminds us that while we don't always understand God's ways, we can always trust in His love and power. Her healing has strengthened the faith of many and serves as a powerful reminder of God's miraculous work in our lives.",
    },
  },
  {
    id: 18,
    title: 'From Homelessness to Hope: A Community Story',
    excerpt:
      'How a local church community helped transform lives and provide hope to those in need.',
    category: 'Inspirational Stories',
    image: '/images/artist-3.jpg',
    readTime: '6 min',
    views: '18.7K',
    comments: 201,
    likes: 567,
    videoUrl: 'https://example.com/videos/homelessness-hope.mp4',
    isLatest: true,
    author: 'David Martinez',
    date: '2025-01-17',
    fullStory: {
      introduction:
        'Through the compassionate efforts of a local church community, several individuals experiencing homelessness have found not just shelter, but hope, dignity, and a path to a new life.',
      sections: [
        {
          heading: 'The Initiative',
          paragraphs: [
            'What began as a simple meal program has grown into a comprehensive ministry that addresses not only immediate physical needs but also provides long-term support for those seeking to rebuild their lives. The program includes temporary housing, job training, counseling services, and spiritual guidance.',
            "Church members volunteer their time and resources to provide meals, clothing, and essential supplies. But more importantly, they offer friendship, encouragement, and the message of God's love to those who have often felt forgotten by society.",
          ],
        },
        {
          heading: 'Transformed Lives',
          paragraphs: [
            'Several program participants have successfully transitioned from homelessness to stable housing and employment. Their stories of transformation are powerful testimonies to the impact of compassionate community action combined with faith-based support.',
            'One participant, who wishes to remain anonymous, shared: "This church didn\'t just give me a meal or a place to sleep. They gave me hope. They showed me that I mattered to God and to them. That changed everything for me."',
          ],
        },
      ],
      conclusion:
        'This ministry serves as a model for how churches can make a tangible difference in their communities. It demonstrates that when faith is put into action, lives can be transformed, and hope can be restored to those who have lost it. The program continues to grow and impact more lives each year.',
    },
  },
  {
    id: 19,
    title: 'Scholarship Deadline Approaching: Apply Today',
    excerpt:
      "Don't miss out on this opportunity for Christian students pursuing higher education. Application closes soon.",
    category: 'Scholarship Alerts',
    image: '/images/video-thumb-1.jpg',
    readTime: '4 min',
    views: '12.3K',
    comments: 78,
    likes: 234,
    isLatest: true,
    author: 'Dr. Elizabeth Thompson',
    date: '2025-01-21',
    fullStory: {
      introduction:
        'Time is running out to apply for several excellent scholarship opportunities available to Christian students pursuing higher education. These programs offer significant financial support for those called to ministry and Christian service.',
      sections: [
        {
          heading: 'Available Opportunities',
          paragraphs: [
            'Multiple scholarship programs are currently accepting applications, with deadlines approaching in the coming weeks. These scholarships are available for students pursuing degrees in theology, ministry, Christian education, and related fields at accredited Christian universities.',
            'The scholarships vary in amount and scope, with some covering full tuition and others providing partial support. Many also include additional benefits such as mentorship opportunities, networking events, and ministry placement assistance upon graduation.',
          ],
        },
        {
          heading: 'Application Requirements',
          paragraphs: [
            'To apply, students typically need to submit academic transcripts, letters of recommendation from church leaders or mentors, a personal statement describing their calling to ministry, and evidence of financial need. Some programs also require an interview process.',
            "It's important to note that these scholarships are competitive, and early application is strongly recommended. Students should carefully review the requirements for each scholarship and ensure all materials are submitted before the deadline.",
          ],
        },
      ],
      conclusion:
        "We encourage all eligible students to take advantage of these opportunities. Don't let the approaching deadlines cause you to miss out on financial support that could make your educational goals achievable. Apply today and take the next step in your journey of faith and service.",
    },
  },
  {
    id: 20,
    title: 'International Christian University Offers Full Scholarships',
    excerpt:
      'Leading Christian universities are offering fully-funded programs for students from developing countries.',
    category: 'Scholarship Alerts',
    image: '/images/video-thumb-2.jpg',
    readTime: '5 min',
    views: '15.8K',
    comments: 92,
    likes: 345,
    isLatest: true,
    author: 'Dr. Elizabeth Thompson',
    date: '2025-01-20',
    fullStory: {
      introduction:
        'In a significant initiative to support global Christian education, several international Christian universities have announced comprehensive scholarship programs specifically designed for students from developing nations.',
      sections: [
        {
          heading: 'Comprehensive Support',
          paragraphs: [
            'These programs cover full tuition, accommodation, meals, and living expenses, making it possible for students who would otherwise be unable to afford higher education to pursue their academic and ministry goals. The scholarships are available for undergraduate and graduate programs in theology, ministry, education, and related fields.',
            'The universities participating in this initiative are committed to training the next generation of Christian leaders from around the world. They recognize the importance of providing educational opportunities to students from diverse backgrounds and economic circumstances.',
          ],
        },
        {
          heading: 'Global Impact',
          paragraphs: [
            'This initiative aims to address the educational gap that prevents many called to ministry from pursuing their training. By removing financial barriers, these universities hope to equip more leaders who can return to their home countries and make a significant impact in their communities.',
            'The program includes not only financial support but also cultural orientation, academic support services, and mentorship programs designed to help international students succeed in their studies and transition back to their home countries upon graduation.',
          ],
        },
      ],
      conclusion:
        'These scholarship programs represent a significant investment in the future of global Christian ministry. They provide opportunities for students who are called to serve but lack the financial resources to pursue their education. We encourage all eligible students to prayerfully consider applying.',
    },
  },
  {
    id: 21,
    title: 'Mission Organization Hiring Field Workers',
    excerpt:
      'Join our mission team in serving communities around the world. Multiple positions available for passionate individuals.',
    category: 'Jobs (NGO / Faith-based)',
    image: '/images/video-thumb-3.jpg',
    readTime: '6 min',
    views: '9.4K',
    comments: 56,
    likes: 178,
    isLatest: true,
    author: 'Jennifer Adams',
    date: '2025-01-22',
    fullStory: {
      introduction:
        'Our international mission organization is expanding its field operations and is seeking dedicated individuals to join our team in serving communities around the world through faith-based initiatives.',
      sections: [
        {
          heading: 'Serving Communities Globally',
          paragraphs: [
            'We are hiring for multiple positions including community development coordinators, education specialists, healthcare workers, and ministry leaders. These roles involve working directly with local communities to provide practical assistance while sharing the love of Christ.',
            'Field workers will be assigned to various locations based on their skills, experience, and calling. Assignments typically last 2-3 years, with opportunities for extension. All positions include comprehensive training, ongoing support, and competitive compensation packages.',
          ],
        },
        {
          heading: 'Making a Difference',
          paragraphs: [
            'Our organization focuses on holistic ministry, addressing both physical and spiritual needs. Field workers participate in projects ranging from building schools and medical clinics to leading Bible studies and discipleship programs.',
            'The work is challenging but deeply rewarding, offering opportunities to see lives transformed and communities strengthened. Workers become part of a supportive team and have access to resources and training to help them succeed in their assignments.',
          ],
        },
      ],
      conclusion:
        "If you feel called to serve in missions and are passionate about making a difference in the lives of others, we encourage you to apply. This is an opportunity to use your gifts and talents to advance God's kingdom while growing personally and professionally.",
    },
  },
  {
    id: 22,
    title: 'Christian School Seeking Qualified Teachers',
    excerpt:
      "A faith-based school is looking for dedicated educators to join their team and make a difference in students' lives.",
    category: 'Jobs (NGO / Faith-based)',
    image: '/images/hero-bg.jpg',
    readTime: '5 min',
    views: '11.2K',
    comments: 67,
    likes: 256,
    isLatest: true,
    author: 'Jennifer Adams',
    date: '2025-01-23',
    fullStory: {
      introduction:
        'Our Christian school is seeking passionate, qualified teachers to join our team and help shape the next generation of Christian leaders through excellent education grounded in biblical truth.',
      sections: [
        {
          heading: 'Teaching Positions Available',
          paragraphs: [
            'We have openings in multiple subject areas including mathematics, science, English, history, and Bible studies. We are also seeking specialists in music, art, physical education, and special education. All positions require a commitment to integrating faith and learning.',
            "Our school serves students from kindergarten through high school, providing a comprehensive education that prepares them academically while nurturing their spiritual growth. Teachers have the unique opportunity to impact students' lives both in and out of the classroom.",
          ],
        },
        {
          heading: 'Our Mission and Values',
          paragraphs: [
            "We are committed to providing excellent academic instruction while helping students develop a biblical worldview and a heart for serving others. Our teachers are not just educators but also mentors and role models who invest in students' character development.",
            'The school offers competitive salaries, comprehensive benefits, professional development opportunities, and a supportive community of fellow educators. We value our teachers and provide the resources and support they need to succeed.',
          ],
        },
      ],
      conclusion:
        "If you are a dedicated educator with a heart for Christian education and a desire to make a lasting impact on students' lives, we encourage you to apply. Join us in our mission to equip the next generation with both knowledge and wisdom, preparing them to serve God and others.",
    },
  },
  {
    id: 23,
    title: 'Review: "I Can Only Imagine" - A Must-Watch',
    excerpt:
      'An emotional and inspiring film that tells the true story behind one of the most beloved Christian songs.',
    category: 'Christian Movie Reviews',
    image: '/images/album-1.jpg',
    readTime: '5 min',
    views: '13.5K',
    comments: 145,
    likes: 432,
    videoUrl: 'https://example.com/videos/i-can-only-imagine-review.mp4',
    isLatest: true,
    author: 'Michael Chen',
    date: '2025-01-18',
    fullStory: {
      introduction:
        '"I Can Only Imagine" is a powerful biographical film that tells the inspiring true story of Bart Millard, lead singer of the Christian band MercyMe, and the journey that led to the creation of one of the most beloved songs in contemporary Christian music.',
      sections: [
        {
          heading: 'A Story of Redemption',
          paragraphs: [
            "The film beautifully portrays Bart's difficult relationship with his father and how God used that pain to create something beautiful. The story is one of forgiveness, redemption, and the power of God to transform broken relationships. The performances are heartfelt and authentic, making the emotional journey deeply moving.",
            'What makes this film particularly powerful is its honesty about pain and struggle, while never losing sight of hope and redemption. It shows that God can use our deepest hurts to create something that ministers to millions of people.',
          ],
        },
        {
          heading: 'Impact and Message',
          paragraphs: [
            'The film has resonated with audiences worldwide, many of whom have been moved to tears by its message of forgiveness and hope. It serves as a powerful reminder that our stories, even the painful parts, can be used by God for His glory.',
            '"I Can Only Imagine" is more than just a movie about a song; it\'s a testament to God\'s faithfulness, the power of forgiveness, and the hope we have in Christ. The film encourages viewers to examine their own relationships and to trust God with their pain.',
          ],
        },
      ],
      conclusion:
        "This film is a must-watch for anyone who appreciates powerful storytelling, authentic faith narratives, and stories of redemption. It's a reminder that God can take our brokenness and turn it into something beautiful that blesses others. Highly recommended for families, small groups, and anyone seeking inspiration.",
    },
  },
  {
    id: 24,
    title: 'Film Review: "War Room" - Prayer in Action',
    excerpt:
      "A compelling review of this powerful film about the importance of prayer and faith in overcoming life's challenges.",
    category: 'Christian Movie Reviews',
    image: '/images/album-2.jpg',
    readTime: '6 min',
    views: '16.8K',
    comments: 178,
    likes: 521,
    isLatest: true,
    author: 'Michael Chen',
    date: '2025-01-13',
    fullStory: {
      introduction:
        '"War Room" is a powerful film that demonstrates the transformative power of prayer through the story of a family facing marital struggles and how an older woman\'s wisdom about prayer changes everything.',
      sections: [
        {
          heading: 'The Power of Prayer',
          paragraphs: [
            'The film follows Elizabeth Jordan, a real estate agent whose marriage is falling apart. When she meets Miss Clara, an elderly woman with a "war room" - a dedicated prayer closet - Elizabeth learns that prayer is not just a religious ritual but a powerful weapon in spiritual warfare.',
            "Through Miss Clara's mentorship, Elizabeth discovers how to pray strategically for her marriage, her husband, and her family. The film beautifully illustrates how prayer can change circumstances, but more importantly, how it changes the person praying.",
          ],
        },
        {
          heading: 'Practical Faith Application',
          paragraphs: [
            '"War Room" is particularly effective because it shows practical ways to incorporate prayer into daily life. The concept of a "war room" - a dedicated space for prayer - has inspired many viewers to create their own prayer spaces and develop more consistent prayer lives.',
            'The film addresses real issues that many families face, making it relatable and impactful. It shows that prayer is not a last resort but a first response, and that God is faithful to answer when we seek Him with sincerity and persistence.',
          ],
        },
      ],
      conclusion:
        'This film is more than entertainment; it\'s a call to action for believers to take prayer seriously. "War Room" has inspired countless viewers to deepen their prayer lives and to trust God with their most challenging circumstances. It\'s a film that will leave you encouraged and motivated to fight your battles on your knees.',
    },
  },

  // Trending Stories
  {
    id: 25,
    title: 'Gospel Artist Breaks Streaming Records',
    excerpt:
      'A renowned gospel artist has broken all-time streaming records, reaching millions with their message of hope and faith.',
    category: 'Christian Celebrity News',
    readTime: '3 min',
    views: '45.2K',
    comments: 234,
    image: '/images/video-thumb-1.jpg',
    videoUrl: 'https://example.com/videos/streaming-records.mp4',
    rank: 1,
    isTrending: true,
    author: 'Sarah Johnson',
    date: '2025-01-19',
    fullStory: {
      introduction:
        'Gospel music sensation has achieved an unprecedented milestone, breaking all-time streaming records and reaching millions of listeners worldwide with messages of hope and faith.',
      sections: [
        {
          heading: 'Record-Breaking Achievement',
          paragraphs: [
            "The artist's latest album has surpassed previous records, with songs being streamed millions of times across various platforms. This achievement demonstrates the growing global appetite for faith-based music and the power of gospel music to transcend cultural boundaries.",
            "Industry analysts attribute this success to the artist's authentic message, exceptional musical talent, and the timing of the release, which has resonated deeply with audiences seeking hope and inspiration.",
          ],
        },
      ],
      conclusion:
        'This record-breaking achievement represents a significant moment for gospel music, proving that faith-based content can compete at the highest levels of the music industry while maintaining its core message of hope and redemption.',
    },
  },
  {
    id: 26,
    title: 'Major Church Event Draws Thousands',
    excerpt:
      'An annual church conference has drawn thousands of attendees from around the world, creating a powerful gathering of faith.',
    category: 'Church & Ministry Announcements',
    readTime: '4 min',
    views: '38.7K',
    comments: 189,
    image: '/images/video-thumb-2.jpg',
    rank: 2,
    isTrending: true,
    author: 'Pastor Michael Williams',
    date: '2025-01-18',
    fullStory: {
      introduction:
        'The annual international church conference concluded this week, drawing thousands of believers from around the world for a powerful gathering that has become one of the most significant events in the Christian calendar.',
      sections: [
        {
          heading: 'A Global Gathering',
          paragraphs: [
            'Attendees from over 50 countries came together for three days of worship, teaching, and fellowship. The conference featured renowned speakers, powerful worship sessions, and opportunities for networking and ministry collaboration.',
            'The event has grown significantly over the years, reflecting the global nature of the Christian faith and the desire for believers to connect across cultural and denominational lines.',
          ],
        },
      ],
      conclusion:
        "The conference's success demonstrates the hunger for authentic Christian community and the power of gathering together in faith. Plans are already underway for next year's event, which promises to be even more impactful.",
    },
  },
  {
    id: 27,
    title: 'Incredible Testimony Goes Viral',
    excerpt:
      'A powerful testimony of transformation has gone viral, inspiring millions and showing the power of faith and redemption.',
    category: 'Inspirational Stories',
    readTime: '5 min',
    views: '52.1K',
    comments: 312,
    image: '/images/video-thumb-3.jpg',
    videoUrl: 'https://example.com/videos/viral-testimony.mp4',
    rank: 3,
    isTrending: true,
    author: 'David Martinez',
    date: '2025-01-16',
    fullStory: {
      introduction:
        "A powerful testimony shared on social media has gone viral, reaching millions of people and demonstrating the incredible power of God's transforming love.",
      sections: [
        {
          heading: 'The Viral Moment',
          paragraphs: [
            'What began as a simple video testimony shared by a church member has now been viewed millions of times across various platforms. The story of transformation from addiction to ministry has resonated with people worldwide, many of whom are sharing their own stories of hope.',
            'The testimony has sparked conversations about faith, redemption, and the possibility of change, reaching far beyond the Christian community and touching hearts across different backgrounds and beliefs.',
          ],
        },
      ],
      conclusion:
        'This viral testimony serves as a powerful reminder that God can use our stories to impact others in ways we never imagined. It demonstrates the reach of social media when used to share messages of hope and redemption.',
    },
  },
  {
    id: 28,
    title: 'New Scholarship Program Announced',
    excerpt:
      'A major scholarship program has been announced, offering full funding for Christian students pursuing higher education.',
    category: 'Scholarship Alerts',
    readTime: '3 min',
    views: '29.3K',
    comments: 156,
    image: '/images/album-1.jpg',
    rank: 4,
    isTrending: true,
    author: 'Dr. Elizabeth Thompson',
    date: '2025-01-20',
    fullStory: {
      introduction:
        'A major new scholarship program has been announced, offering comprehensive financial support for Christian students called to ministry and theological education.',
      sections: [
        {
          heading: 'Program Details',
          paragraphs: [
            'The scholarship program will provide full tuition coverage, living expenses, and additional support for students pursuing degrees in theology, ministry, and related fields. The program is designed to remove financial barriers for those called to serve.',
            'Applications are now being accepted, with priority given to students from underserved communities and those demonstrating both academic excellence and a clear calling to ministry.',
          ],
        },
      ],
      conclusion:
        'This scholarship program represents a significant investment in the future of Christian ministry, ensuring that financial limitations do not prevent those called to serve from receiving the training they need.',
    },
  },
  {
    id: 29,
    title: 'Faith-Based Organizations Hiring Now',
    excerpt:
      'Multiple faith-based organizations are actively hiring, offering opportunities to serve and make a difference in communities.',
    category: 'Jobs (NGO / Faith-based)',
    readTime: '4 min',
    views: '41.8K',
    comments: 278,
    image: '/images/album-2.jpg',
    rank: 5,
    isTrending: true,
    author: 'Jennifer Adams',
    date: '2025-01-21',
    fullStory: {
      introduction:
        'Multiple faith-based organizations are currently expanding their teams, offering numerous opportunities for individuals passionate about serving others and making a difference in communities.',
      sections: [
        {
          heading: 'Available Positions',
          paragraphs: [
            'Positions are available in various areas including program coordination, community development, education, healthcare, and ministry leadership. These roles offer the opportunity to combine professional skills with faith-based service.',
            "Organizations are seeking individuals with relevant experience, a heart for service, and a commitment to the mission of advancing God's kingdom through practical action.",
          ],
        },
      ],
      conclusion:
        'These opportunities represent a chance to use your professional skills in a context that aligns with your faith and values, making a tangible difference in the lives of others while growing personally and professionally.',
    },
  },
  {
    id: 30,
    title: 'New Christian Film Tops Box Office',
    excerpt:
      'A new Christian film has topped the box office, proving that faith-based content resonates with audiences worldwide.',
    category: 'Christian Movie Reviews',
    readTime: '5 min',
    views: '33.5K',
    comments: 201,
    image: '/images/album-3.jpg',
    videoUrl: 'https://example.com/videos/box-office-film.mp4',
    rank: 6,
    isTrending: true,
    author: 'Michael Chen',
    date: '2025-01-17',
    fullStory: {
      introduction:
        'A new Christian film has achieved remarkable success at the box office, topping charts and proving that quality faith-based content resonates strongly with audiences worldwide.',
      sections: [
        {
          heading: 'Box Office Success',
          paragraphs: [
            "The film's success has surprised industry analysts and demonstrated the significant market for faith-based entertainment. It has outperformed many mainstream releases, showing that audiences are hungry for content that reflects their values and beliefs.",
            "The film's success is attributed to its high production quality, compelling storytelling, and authentic representation of faith. It has received praise from both Christian and secular critics for its artistic merit and positive message.",
          ],
        },
      ],
      conclusion:
        'This box office success represents a significant moment for Christian cinema, proving that faith-based films can achieve commercial success while maintaining their core message and values. It opens doors for more quality Christian content in the future.',
    },
  },
  {
    id: 31,
    title: "Pastor's Message Reaches Global Audience",
    excerpt:
      "A pastor's powerful message has reached a global audience through social media, touching hearts and changing lives.",
    category: 'Christian Celebrity News',
    readTime: '4 min',
    views: '27.9K',
    comments: 167,
    image: '/images/artist-1.jpg',
    videoUrl: 'https://example.com/videos/pastor-message.mp4',
    rank: 7,
    isTrending: true,
    author: 'Rachel Green',
    date: '2025-01-15',
    fullStory: {
      introduction:
        "A pastor's powerful message shared on social media has reached a global audience, demonstrating the impact of digital ministry in the modern age.",
      sections: [
        {
          heading: 'Digital Ministry Impact',
          paragraphs: [
            'The message, originally delivered to a local congregation, was recorded and shared online, where it quickly gained traction. Within days, it had been viewed millions of times and shared across various platforms, reaching people in countries around the world.',
            "The message's universal themes of hope, grace, and redemption have resonated with diverse audiences, many of whom have reached out to express how it has impacted their lives and strengthened their faith.",
          ],
        },
      ],
      conclusion:
        'This viral message demonstrates the power of digital ministry to reach beyond traditional boundaries, bringing the Gospel to people who might never step foot in a church building. It represents the evolving nature of ministry in the digital age.',
    },
  },
  {
    id: 32,
    title: 'Youth Ministry Program Launches Successfully',
    excerpt:
      'A new youth ministry program has launched successfully, engaging young people and building a strong community of faith.',
    category: 'Church & Ministry Announcements',
    readTime: '5 min',
    views: '35.4K',
    comments: 223,
    image: '/images/artist-2.jpg',
    rank: 8,
    isTrending: true,
    author: 'Pastor Michael Williams',
    date: '2025-01-19',
    fullStory: {
      introduction:
        'A new comprehensive youth ministry program has launched with great success, engaging young people and creating a vibrant community of faith that is already making a significant impact.',
      sections: [
        {
          heading: 'Program Success',
          paragraphs: [
            'The program has exceeded expectations in its first months, with strong attendance and enthusiastic participation from youth. The program combines relevant teaching, authentic community, and practical service opportunities that resonate with young people.',
            'Parents and church leaders have noted the positive changes in participating youth, including increased engagement with faith, stronger relationships, and a greater sense of purpose and belonging.',
          ],
        },
      ],
      conclusion:
        "The successful launch of this youth ministry program demonstrates the importance of investing in the next generation. It provides a model for other churches seeking to effectively engage and disciple young people in today's world.",
    },
  },
  {
    id: 33,
    title: 'Miracle Story Inspires Thousands',
    excerpt:
      'A remarkable story of healing and miracles has inspired thousands, strengthening faith and bringing hope to many.',
    category: 'Inspirational Stories',
    readTime: '6 min',
    views: '31.2K',
    comments: 198,
    image: '/images/artist-3.jpg',
    rank: 9,
    isTrending: true,
    author: 'Amanda Foster',
    date: '2025-01-14',
    fullStory: {
      introduction:
        "A remarkable story of healing and miracles has captured the attention of thousands, serving as a powerful testimony to God's faithfulness and the reality of His miraculous work.",
      sections: [
        {
          heading: 'The Miracle',
          paragraphs: [
            'The story involves a medical situation that doctors described as hopeless, yet through prayer and faith, a miraculous healing occurred that has left medical professionals amazed and believers encouraged.',
            'The testimony has been shared widely, with many people reporting that it has strengthened their own faith and given them hope in their own challenging circumstances.',
          ],
        },
      ],
      conclusion:
        "This miracle story serves as a powerful reminder that God is still at work in our world today, performing miracles and demonstrating His power and love. It encourages believers to continue praying with faith and trusting in God's timing and ways.",
    },
  },
  {
    id: 34,
    title: 'Scholarship Deadline Extended',
    excerpt:
      'Due to high demand, the scholarship application deadline has been extended, giving more students a chance to apply.',
    category: 'Scholarship Alerts',
    readTime: '3 min',
    views: '28.6K',
    comments: 145,
    image: '/images/video-thumb-1.jpg',
    rank: 10,
    isTrending: true,
    author: 'Dr. Elizabeth Thompson',
    date: '2025-01-22',
    fullStory: {
      introduction:
        'Due to overwhelming interest and numerous requests, the scholarship application deadline has been extended, providing more students with the opportunity to apply for these valuable educational opportunities.',
      sections: [
        {
          heading: 'Extended Opportunity',
          paragraphs: [
            "The extension reflects the high demand for these scholarship programs and the organization's commitment to ensuring that all eligible students have adequate time to complete their applications thoroughly.",
            'Students who were concerned about meeting the original deadline now have additional time to gather required documents, complete their applications, and seek necessary recommendations.',
          ],
        },
      ],
      conclusion:
        "This deadline extension demonstrates the organization's commitment to accessibility and their desire to support as many students as possible in pursuing their educational and ministry goals.",
    },
  },
  {
    id: 35,
    title: 'Mission Trip Opportunities Available',
    excerpt:
      'Multiple mission trip opportunities are now available for those looking to serve and make a difference globally.',
    category: 'Jobs (NGO / Faith-based)',
    readTime: '5 min',
    views: '39.1K',
    comments: 267,
    image: '/images/video-thumb-2.jpg',
    rank: 11,
    isTrending: true,
    author: 'Jennifer Adams',
    date: '2025-01-20',
    fullStory: {
      introduction:
        'Multiple mission organizations are currently accepting applications for upcoming mission trips, offering opportunities for individuals and teams to serve communities around the world.',
      sections: [
        {
          heading: 'Trip Opportunities',
          paragraphs: [
            'Trips are available to various locations, focusing on different types of ministry including construction projects, medical missions, education programs, and evangelistic outreach. Each trip is designed to meet specific needs in the host communities while providing meaningful service opportunities for participants.',
            'Organizations provide comprehensive support including training, travel arrangements, accommodation, and on-field guidance. No prior mission experience is required for most trips, making them accessible to first-time participants.',
          ],
        },
      ],
      conclusion:
        "Mission trips offer life-changing experiences that combine service, cultural immersion, and spiritual growth. They provide opportunities to make a tangible difference while growing in faith and understanding of God's global work.",
    },
  },
  {
    id: 36,
    title: 'Christian Film Festival Highlights',
    excerpt:
      'The annual Christian film festival has showcased incredible films, celebrating faith-based storytelling and creativity.',
    category: 'Christian Movie Reviews',
    readTime: '6 min',
    views: '24.8K',
    comments: 178,
    image: '/images/video-thumb-3.jpg',
    videoUrl: 'https://example.com/videos/film-festival.mp4',
    rank: 12,
    isTrending: true,
    author: 'Michael Chen',
    date: '2025-01-12',
    fullStory: {
      introduction:
        'The annual Christian film festival concluded this week, showcasing an impressive array of faith-based films that demonstrated the growing quality and diversity of Christian cinema.',
      sections: [
        {
          heading: 'Festival Highlights',
          paragraphs: [
            'The festival featured films spanning various genres, from dramas and documentaries to comedies and historical epics. Each film demonstrated excellence in storytelling while maintaining strong faith-based themes and values.',
            'Awards were presented in multiple categories, recognizing outstanding achievement in directing, acting, cinematography, and overall impact. The festival also included workshops and panel discussions with filmmakers and industry professionals.',
          ],
        },
      ],
      conclusion:
        "The festival's success highlights the vibrant state of Christian filmmaking and the growing recognition of faith-based content as a legitimate and important part of the entertainment industry. It provides encouragement and inspiration for future Christian filmmakers.",
    },
  },
  {
    id: 37,
    title: 'Gospel Music Awards Ceremony',
    excerpt:
      'The annual gospel music awards ceremony celebrated the best in Christian music, honoring artists and their contributions.',
    category: 'Christian Celebrity News',
    readTime: '4 min',
    views: '22.3K',
    comments: 134,
    image: '/images/album-1.jpg',
    videoUrl: 'https://example.com/videos/gospel-awards.mp4',
    rank: 13,
    isTrending: true,
    author: 'Sarah Johnson',
    date: '2025-01-11',
    fullStory: {
      introduction:
        'The annual gospel music awards ceremony brought together the best in Christian music, honoring artists for their contributions to the genre and celebrating the impact of gospel music worldwide.',
      sections: [
        {
          heading: 'A Night of Celebration',
          paragraphs: [
            'The ceremony featured outstanding performances, emotional acceptance speeches, and recognition of both established artists and emerging talent. The event highlighted the diversity within gospel music, from traditional hymns to contemporary worship.',
            'Awards were presented in multiple categories, recognizing excellence in various aspects of gospel music including songwriting, performance, and overall contribution to the genre.',
          ],
        },
      ],
      conclusion:
        "The awards ceremony serves as an important recognition of the talent and dedication within the gospel music community. It celebrates not just musical achievement but also the ministry impact of these artists' work.",
    },
  },
  {
    id: 38,
    title: 'Church Planting Initiative Announced',
    excerpt:
      'A new church planting initiative has been announced, aiming to establish new congregations in underserved areas.',
    category: 'Church & Ministry Announcements',
    readTime: '6 min',
    views: '36.7K',
    comments: 256,
    image: '/images/album-2.jpg',
    rank: 14,
    isTrending: true,
    author: 'Pastor Michael Williams',
    date: '2025-01-13',
    fullStory: {
      introduction:
        'A major new church planting initiative has been announced, with plans to establish new congregations in underserved areas over the next several years.',
      sections: [
        {
          heading: 'The Initiative',
          paragraphs: [
            'The initiative will provide training, financial support, and ongoing mentorship for church planters who feel called to start new congregations in areas where there is limited access to vibrant Christian community.',
            'The program includes comprehensive training in church planting, leadership development, and community engagement. Church planters will receive ongoing support and resources to help them establish healthy, growing congregations.',
          ],
        },
      ],
      conclusion:
        'This church planting initiative represents a significant investment in expanding the reach of the Gospel and ensuring that more communities have access to vibrant, healthy churches. It provides opportunities for those called to church planting to fulfill their calling with proper support and resources.',
    },
  },
  {
    id: 39,
    title: 'From Prison to Pulpit: A Story of Redemption',
    excerpt:
      'An inspiring story of transformation from prison to pulpit, showing how faith can change even the most difficult circumstances.',
    category: 'Inspirational Stories',
    readTime: '7 min',
    views: '43.5K',
    comments: 289,
    image: '/images/album-3.jpg',
    videoUrl: 'https://example.com/videos/prison-to-pulpit.mp4',
    rank: 15,
    isTrending: true,
    author: 'David Martinez',
    date: '2025-01-10',
    fullStory: {
      introduction:
        "In an extraordinary story of redemption, a former inmate has become a pastor, demonstrating the transformative power of faith and God's ability to use anyone for His purposes.",
      sections: [
        {
          heading: 'The Transformation',
          paragraphs: [
            'The story follows a man who found faith while serving a prison sentence and felt called to ministry. After his release, he pursued theological education and is now serving as a pastor, using his testimony to reach others who are where he once was.',
            'His ministry focuses particularly on reaching those in the criminal justice system and helping them find hope and purpose through faith. His story serves as a powerful example that no one is beyond redemption.',
          ],
        },
      ],
      conclusion:
        "This story of transformation from prison to pulpit is a powerful reminder of God's grace and His ability to use our past, even our mistakes, for His glory. It demonstrates that our past does not define our future when we surrender to God's plan for our lives.",
    },
  },

  // Video News Items (items with videoUrl and duration)
  {
    id: 40,
    title: 'Gospel Artist Interview: Behind the Music',
    excerpt:
      'An exclusive interview with a renowned gospel artist discussing their creative process and journey in the music industry.',
    category: 'Christian Celebrity News',
    duration: '8:45',
    image: '/images/video-thumb-1.jpg',
    views: '24K',
    readTime: '8 min',
    comments: 45,
    videoUrl: 'https://example.com/videos/gospel-interview.mp4',
    author: 'Sarah Johnson',
    date: '2025-01-19',
    fullStory: {
      introduction:
        'In this exclusive video interview, we sit down with a renowned gospel artist to discuss their creative process, musical journey, and the faith that inspires their work.',
      sections: [
        {
          heading: 'The Creative Process',
          paragraphs: [
            'The artist shares insights into how they approach songwriting, drawing inspiration from Scripture, personal experiences, and the stories of others. They discuss the balance between artistic expression and ministry, and how they seek to create music that both entertains and edifies.',
            "Viewers get a behind-the-scenes look at the recording process, the collaboration with other musicians, and the prayerful approach taken to each project. The interview reveals the heart behind the music and the desire to use talent for God's glory.",
          ],
        },
      ],
      conclusion:
        'This interview provides valuable insights into the world of gospel music and the dedication required to create music that ministers to the soul while maintaining artistic excellence.',
    },
  },
  {
    id: 41,
    title: 'Award-Winning Gospel Artist Shares Journey',
    excerpt:
      'Award-winning gospel artist opens up about their path to success and the faith that guides their music career.',
    category: 'Christian Celebrity News',
    duration: '12:30',
    image: '/images/video-thumb-2.jpg',
    views: '18K',
    readTime: '12 min',
    comments: 32,
    videoUrl: 'https://example.com/videos/award-winning-artist.mp4',
    author: 'Sarah Johnson',
    date: '2025-01-18',
    fullStory: {
      introduction:
        'An award-winning gospel artist shares their personal journey from humble beginnings to international recognition, highlighting the role of faith throughout their career.',
      sections: [
        {
          heading: 'The Journey',
          paragraphs: [
            "The video chronicles the artist's journey, from early struggles and setbacks to breakthrough moments and current success. They share how faith sustained them through difficult times and how they've remained grounded despite fame.",
            "The interview includes reflections on the responsibility that comes with platform, the importance of staying true to one's calling, and advice for aspiring artists who want to use their gifts for ministry.",
          ],
        },
      ],
      conclusion:
        "This inspiring story demonstrates that success in gospel music is not just about talent, but about faithfulness, perseverance, and keeping God at the center of one's career and life.",
    },
  },
  {
    id: 42,
    title: 'Church Service Highlights: Sunday Worship',
    excerpt:
      'Highlights from our inspiring Sunday worship service featuring powerful messages and uplifting music.',
    category: 'Church & Ministry Announcements',
    duration: '6:15',
    image: '/images/video-thumb-3.jpg',
    views: '31K',
    readTime: '6 min',
    comments: 78,
    videoUrl: 'https://example.com/videos/church-service.mp4',
    author: 'Pastor Michael Williams',
    date: '2025-01-25',
    fullStory: {
      introduction:
        'Experience the highlights from our recent Sunday worship service, featuring powerful worship, an inspiring message, and the sense of community that makes our church family special.',
      sections: [
        {
          heading: 'Service Highlights',
          paragraphs: [
            'This video captures the best moments from our worship service, including congregational singing, special music, and key points from the sermon. It provides a glimpse into the vibrant worship and fellowship that characterizes our church community.',
            'For those unable to attend in person, this video offers an opportunity to participate in the service and experience the same worship and teaching that blessed those who were present.',
          ],
        },
      ],
      conclusion:
        'We hope this video encourages you and provides a taste of what you can expect when you join us for worship. We look forward to welcoming you in person soon.',
    },
  },
  {
    id: 43,
    title: 'New Ministry Program Launch Event',
    excerpt:
      'Watch the exciting launch of our new ministry program designed to serve and uplift our community.',
    category: 'Church & Ministry Announcements',
    duration: '15:00',
    image: '/images/hero-bg.jpg',
    views: '42K',
    readTime: '15 min',
    comments: 112,
    videoUrl: 'https://example.com/videos/ministry-launch.mp4',
    author: 'Pastor Michael Williams',
    date: '2025-01-24',
    fullStory: {
      introduction:
        'Watch the exciting launch event for our new community ministry program, designed to serve and uplift those in need while sharing the love of Christ.',
      sections: [
        {
          heading: 'Launch Event',
          paragraphs: [
            "The video captures the launch event, including presentations about the program's goals, testimonies from those who will benefit, and the official announcement. It provides comprehensive information about how the ministry will operate and how people can get involved.",
            'The event featured special speakers, worship, and opportunities for attendees to sign up as volunteers or learn more about how they can support the ministry through prayer and giving.',
          ],
        },
      ],
      conclusion:
        "This launch event marks the beginning of an exciting new chapter in our church's community outreach. We invite you to watch and learn how you can be part of this important ministry.",
    },
  },
  {
    id: 44,
    title: 'Powerful Testimony: From Darkness to Light',
    excerpt:
      'A moving testimony of transformation showing how faith can bring light into the darkest moments of life.',
    category: 'Inspirational Stories',
    duration: '10:20',
    image: '/images/album-1.jpg',
    views: '28K',
    readTime: '10 min',
    comments: 89,
    videoUrl: 'https://example.com/videos/testimony-darkness-light.mp4',
    author: 'David Martinez',
    date: '2025-01-16',
    fullStory: {
      introduction:
        "In this powerful video testimony, hear a moving story of transformation from darkness to light, demonstrating how faith can bring hope and purpose even in life's darkest moments.",
      sections: [
        {
          heading: 'The Testimony',
          paragraphs: [
            'The video features a personal testimony shared with honesty and vulnerability, detailing a journey from despair to hope, from darkness to light. The story is told with raw emotion and authenticity, making it relatable to anyone who has experienced struggle.',
            'Through the testimony, viewers see how God can take our brokenness and use it for His glory, how community support makes a difference, and how faith provides a foundation that cannot be shaken.',
          ],
        },
      ],
      conclusion:
        "This testimony serves as a beacon of hope for those currently in dark places, showing that transformation is possible and that God's light can penetrate even the deepest darkness.",
    },
  },
  {
    id: 45,
    title: 'Miracle Healing: A Story of Faith',
    excerpt:
      'An incredible story of healing and restoration that demonstrates the power of prayer and unwavering faith.',
    category: 'Inspirational Stories',
    duration: '7:30',
    image: '/images/album-2.jpg',
    views: '35K',
    readTime: '7 min',
    comments: 134,
    videoUrl: 'https://example.com/videos/miracle-healing.mp4',
    author: 'Amanda Foster',
    date: '2025-01-15',
    fullStory: {
      introduction:
        'This video documents an incredible story of healing and restoration, demonstrating the power of prayer and unwavering faith in the face of seemingly impossible circumstances.',
      sections: [
        {
          heading: 'The Miracle',
          paragraphs: [
            'The video tells the story of a medical situation that doctors described as hopeless, yet through prayer and faith, a miraculous healing occurred. It includes interviews with the person who was healed, their family, and medical professionals who witnessed the transformation.',
            "The story is told with sensitivity and respect, focusing on God's faithfulness and the power of prayer, while also acknowledging the role of medical treatment and the support of the faith community.",
          ],
        },
      ],
      conclusion:
        "This miracle story serves as a powerful reminder that God is still at work in our world today, performing miracles and demonstrating His power and love. It encourages viewers to continue praying with faith and trusting in God's timing.",
    },
  },
  {
    id: 46,
    title: 'Scholarship Information Session Recording',
    excerpt:
      'Complete recording of our scholarship information session covering application processes and available opportunities.',
    category: 'Scholarship Alerts',
    duration: '14:15',
    image: '/images/album-3.jpg',
    views: '19K',
    readTime: '14 min',
    comments: 56,
    videoUrl: 'https://example.com/videos/scholarship-session.mp4',
    author: 'Dr. Elizabeth Thompson',
    date: '2025-01-20',
    fullStory: {
      introduction:
        'This complete recording of our scholarship information session provides comprehensive details about available opportunities, application processes, and eligibility requirements.',
      sections: [
        {
          heading: 'Session Content',
          paragraphs: [
            'The video covers all aspects of the scholarship programs, including available amounts, eligibility criteria, application requirements, deadlines, and selection processes. It also includes a question-and-answer session addressing common concerns and questions.',
            'Viewers will gain a complete understanding of what scholarships are available, how to apply, what to expect during the selection process, and how to maximize their chances of receiving financial support.',
          ],
        },
      ],
      conclusion:
        "We encourage all interested students to watch this information session carefully and to reach out with any additional questions. Don't miss this opportunity to receive financial support for your education.",
    },
  },
  {
    id: 47,
    title: 'How to Apply for Christian Scholarships',
    excerpt:
      'A comprehensive guide on applying for Christian scholarships with tips and step-by-step instructions.',
    category: 'Scholarship Alerts',
    duration: '9:45',
    image: '/images/artist-1.jpg',
    views: '22K',
    readTime: '9 min',
    comments: 67,
    videoUrl: 'https://example.com/videos/scholarship-application.mp4',
    author: 'Dr. Elizabeth Thompson',
    date: '2025-01-21',
    fullStory: {
      introduction:
        'This comprehensive video guide walks you through the process of applying for Christian scholarships, providing practical tips and step-by-step instructions to help you submit a strong application.',
      sections: [
        {
          heading: 'Application Guide',
          paragraphs: [
            'The video covers everything from finding the right scholarships to preparing your application materials, writing compelling personal statements, securing strong recommendations, and following up after submission.',
            'It includes insider tips from scholarship committee members, common mistakes to avoid, and strategies for standing out in a competitive applicant pool. The guide is designed to demystify the application process and give you confidence.',
          ],
        },
      ],
      conclusion:
        "With the guidance provided in this video, you'll be well-equipped to submit strong scholarship applications. Take advantage of these opportunities to fund your education and pursue your calling.",
    },
  },
  {
    id: 48,
    title: 'NGO Work: Making a Difference',
    excerpt:
      'See how our NGO is making a real difference in communities through faith-based service and outreach programs.',
    category: 'Jobs (NGO / Faith-based)',
    duration: '11:20',
    image: '/images/artist-2.jpg',
    views: '27K',
    readTime: '11 min',
    comments: 92,
    videoUrl: 'https://example.com/videos/ngo-work.mp4',
    author: 'Jennifer Adams',
    date: '2025-01-22',
    fullStory: {
      introduction:
        "This video showcases the impactful work of our faith-based NGO, demonstrating how we're making a real difference in communities through service, outreach, and the love of Christ.",
      sections: [
        {
          heading: 'Our Impact',
          paragraphs: [
            'The video highlights various projects and programs, from community development initiatives to educational support, healthcare services, and disaster relief efforts. It features interviews with program beneficiaries, showing the tangible difference our work makes.',
            "Viewers will see the holistic approach we take, addressing both physical and spiritual needs, and the partnerships we've built with local communities to ensure sustainable impact.",
          ],
        },
      ],
      conclusion:
        'This video provides a window into the meaningful work happening through our organization and the lives being transformed. We invite you to learn more about how you can be part of this important mission.',
    },
  },
  {
    id: 49,
    title: 'Mission Trip: Stories from the Field',
    excerpt:
      'Powerful stories and experiences from our mission trip, showing the impact of faith-based service around the world.',
    category: 'Jobs (NGO / Faith-based)',
    duration: '13:10',
    image: '/images/artist-3.jpg',
    views: '33K',
    readTime: '13 min',
    comments: 145,
    videoUrl: 'https://example.com/videos/mission-trip.mp4',
    author: 'Jennifer Adams',
    date: '2025-01-19',
    fullStory: {
      introduction:
        'Join us on a journey as we share powerful stories and experiences from our recent mission trip, documenting the impact of faith-based service in communities around the world.',
      sections: [
        {
          heading: 'Trip Highlights',
          paragraphs: [
            'The video documents the mission trip from start to finish, including preparation, travel, daily activities, and the relationships built with local communities. It captures both the challenges and the joys of mission work.',
            'Viewers will hear from team members about how the trip impacted them, see the work accomplished, and witness the relationships formed. The video also includes testimonies from community members who were served.',
          ],
        },
      ],
      conclusion:
        'This video provides a realistic look at mission work and its impact, both on those being served and those doing the serving. It may inspire you to consider joining a future mission trip and experiencing the blessing of serving others.',
    },
  },
  {
    id: 50,
    title: 'Movie Review: "The Passion of the Christ"',
    excerpt:
      'An in-depth review of this powerful film that portrays the final hours of Jesus Christ with profound impact.',
    category: 'Christian Movie Reviews',
    duration: '8:00',
    image: '/images/video-thumb-1.jpg',
    views: '16K',
    readTime: '8 min',
    comments: 178,
    videoUrl: 'https://example.com/videos/passion-review.mp4',
    author: 'Michael Chen',
    date: '2025-01-13',
    fullStory: {
      introduction:
        'This in-depth video review examines "The Passion of the Christ," one of the most impactful Christian films ever made, analyzing its artistic merit, biblical accuracy, and spiritual impact.',
      sections: [
        {
          heading: 'Film Analysis',
          paragraphs: [
            "The review provides a comprehensive analysis of the film's cinematography, acting, direction, and faithfulness to the biblical account. It discusses the film's controversial aspects and its profound impact on viewers.",
            "The review also explores the film's theological significance, its use of Aramaic and Latin for authenticity, and the way it has influenced both Christian and secular audiences. It addresses both the film's strengths and areas that have generated discussion.",
          ],
        },
      ],
      conclusion:
        "This review helps viewers understand the film's significance in Christian cinema and its ongoing impact. Whether you've seen the film or are considering watching it, this review provides valuable context and insight.",
    },
  },
  {
    id: 51,
    title: 'Film Analysis: "I Can Only Imagine"',
    excerpt:
      'A detailed analysis of this inspiring film that tells the true story behind one of the most beloved Christian songs.',
    category: 'Christian Movie Reviews',
    duration: '6:45',
    image: '/images/video-thumb-2.jpg',
    views: '21K',
    readTime: '6 min',
    comments: 201,
    videoUrl: 'https://example.com/videos/film-analysis.mp4',
    author: 'Michael Chen',
    date: '2025-01-12',
    fullStory: {
      introduction:
        'This detailed video analysis explores "I Can Only Imagine," examining how the film tells the true story behind the beloved song and the powerful themes of forgiveness and redemption it presents.',
      sections: [
        {
          heading: 'Story and Themes',
          paragraphs: [
            "The analysis delves into the film's narrative structure, character development, and the way it handles difficult themes like abuse, loss, and forgiveness. It examines how the film balances entertainment with meaningful storytelling.",
            "The video also discusses the film's faithfulness to the true story, the performances of the actors, and the way the film has resonated with audiences who have experienced similar struggles with family relationships.",
          ],
        },
      ],
      conclusion:
        'This analysis helps viewers appreciate the depth and significance of "I Can Only Imagine" and understand why it has touched so many hearts. The film serves as a powerful reminder of the transformative power of forgiveness and God\'s grace.',
    },
  },
];
