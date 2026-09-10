const mongoose = require('mongoose');
require('dotenv').config();

const Track = require('./models/Track');
const Segment = require('./models/Segment');
const Webinar = require('./models/Webinar');
const Story = require('./models/Story');
const Step = require('./models/Step');
const Stat = require('./models/Stat');
const Myth = require('./models/Myth');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding data...');

  // Clear existing data
  await Track.deleteMany({});
  await Segment.deleteMany({});
  await Webinar.deleteMany({});
  await Story.deleteMany({});
  await Step.deleteMany({});
  await Stat.deleteMany({});
  await Myth.deleteMany({});

  // ============ SEGMENTS ============
  await Segment.insertMany([
    { label: 'Students & Job Seekers', blurb: 'Figure out which career actually fits you before you spend on a course.', icon: 'graduation-cap', sort_order: 1 },
    { label: 'Women Learning From Home', blurb: 'Flexible, women-only sessions and privacy-first learning on your schedule.', icon: 'home', sort_order: 2 },
    { label: 'Small Business Owners', blurb: 'Pick up the digital skills that grow your customers and revenue.', icon: 'store', sort_order: 3 },
  ]);

  // ============ TRACKS ============
  await Track.insertMany([
    {
      title: 'Data Analytics', category: 'tech', category_label: 'Tech',
      pay_range: 'Rs 35k–90k/month', time_to_income: '5–7 months', duration: '14 weeks',
      level: 'Some math helpful',
      thumbnail: 'https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      video_url: '',
      description: 'Turn spreadsheets and dashboards into decisions. Learn Excel, SQL, and a bit of Python to land analyst roles across industries.',
      suitable_for: ['Students & Job Seekers', 'Career switchers'],
      segment_id: null, featured: true, sort_order: 1,
    },
    {
      title: 'Digital Marketing & SEO', category: 'marketing', category_label: 'Digital Marketing',
      pay_range: 'Rs 25k–70k/month', time_to_income: '3–5 months', duration: '10 weeks',
      level: 'No coding needed',
      thumbnail: 'https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      video_url: '',
      description: 'Get found on Google and grow on social. Learn SEO, ads, and content marketing — skills that help you get hired or grow your own business.',
      suitable_for: ['Business Owners', 'Freelancers', 'Job Seekers'],
      segment_id: null, featured: false, sort_order: 2,
    },
    {
      title: 'Social Media Management', category: 'marketing', category_label: 'Digital Marketing',
      pay_range: 'Rs 20k–55k/month', time_to_income: '2–4 months', duration: '8 weeks',
      level: 'Phone-first',
      thumbnail: 'https://images.pexels.com/photos/15406294/pexels-photo-15406294.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      video_url: '',
      description: 'Run Instagram, Facebook, and WhatsApp for small brands. Perfect for learning from home and taking on 2–3 clients at a time.',
      suitable_for: ['Women learning from home', 'Freelancers'],
      segment_id: null, featured: false, sort_order: 3,
    },
    {
      title: 'Graphic & Brand Design', category: 'creative', category_label: 'Creative',
      pay_range: 'Rs 22k–60k/month', time_to_income: '3–5 months', duration: '8 weeks',
      level: 'Creative track',
      thumbnail: 'https://images.pexels.com/photos/20456575/pexels-photo-20456575.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      video_url: '',
      description: 'Design logos, social posts, and brand kits in Canva and Figma. Great for freelancing from home with a portfolio of just 5–6 pieces.',
      suitable_for: ['Women learning from home', 'Freelancers', 'Creatives'],
      segment_id: null, featured: false, sort_order: 4,
    },
    {
      title: 'Beauty & Salon Professional', category: 'creative', category_label: 'Creative',
      pay_range: 'Rs 18k–45k/month', time_to_income: '2–3 months', duration: '6 weeks',
      level: 'Women-only batch',
      thumbnail: 'https://images.pexels.com/photos/5732998/pexels-photo-5732998.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      video_url: '',
      description: 'Offer salon and bridal services from home or on call. Short training, quick income, and a women-only batch that feels safe to learn in.',
      suitable_for: ['Women learning from home', 'Quick income'],
      segment_id: null, featured: false, sort_order: 5,
    },
    {
      title: 'Freelance Content Writing', category: 'freelancing', category_label: 'Freelancing',
      pay_range: 'Rs 15k–50k/month', time_to_income: '2–4 months', duration: '6 weeks',
      level: 'English helpful',
      thumbnail: 'https://images.pexels.com/photos/5827785/pexels-photo-5827785.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      video_url: '',
      description: 'Write blogs, product pages, and social captions for businesses. Start with one client, grow to a steady monthly retainer from home.',
      suitable_for: ['Women learning from home', 'Freelancers', 'Side income'],
      segment_id: null, featured: false, sort_order: 6,
    },
    {
      title: 'Bookkeeping & GST Filing', category: 'business', category_label: 'Business',
      pay_range: 'Rs 20k–55k/month', time_to_income: '3–4 months', duration: '8 weeks',
      level: 'Detail oriented',
      thumbnail: 'https://images.pexels.com/photos/8297225/pexels-photo-8297225.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      video_url: '',
      description: 'Keep accounts clean and file GST for small shops. A steady, in-demand skill you can offer as a service to multiple local businesses.',
      suitable_for: ['Business Owners', 'Freelancers', 'Side income'],
      segment_id: null, featured: false, sort_order: 7,
    },
  ]);

  // ============ WEBINARS ============
  await Webinar.insertMany([
    { title: 'Which tech career is right for you?', date: 'Aug 7', time: '5:00 PM IST', segment_tag: 'Students & Job Seekers', speaker: 'Anjali Mehta, Career Coach', category: 'tech', sort_order: 1 },
    { title: 'Earn from home: freelance skills that pay', date: 'Aug 10', time: '11:00 AM IST', segment_tag: 'Women Learning From Home', speaker: 'Priya Nair, Freelance Mentor', category: 'freelancing', sort_order: 2 },
    { title: 'Get more customers with digital marketing', date: 'Aug 14', time: '6:30 PM IST', segment_tag: 'Small Business Owners', speaker: 'Rahul Verma, Marketing Consultant', category: 'marketing', sort_order: 3 },
    { title: 'Design your first brand kit in Canva', date: 'Aug 18', time: '4:00 PM IST', segment_tag: 'Women Learning From Home', speaker: 'Sneha Rao, Brand Designer', category: 'creative', sort_order: 4 },
  ]);

  // ============ STORIES ============
  await Story.insertMany([
    {
      name: 'Sana Khan', role: 'Junior Web Developer', location: 'Hyderabad',
      quote: 'I almost paid for a course I would have hated. The assessment showed me I fit web development instead — best detour of my life.',
      outcome: 'Hired within 3 months of finishing training',
      avatar: 'https://images.pexels.com/photos/36763595/pexels-photo-36763595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      sort_order: 1,
    },
    {
      name: 'Meera Joshi', role: 'Home-based Freelance Designer', location: 'Pune',
      quote: 'The women-only sessions let me ask anything without feeling judged. I went from zero to my first paying client in 8 weeks.',
      outcome: '5 repeat clients in her first year',
      avatar: 'https://images.pexels.com/photos/6768479/pexels-photo-6768479.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      sort_order: 2,
    },
    {
      name: 'Imran Sheikh', role: 'Bakery Owner', location: 'Lucknow',
      quote: 'I did not need another app. I needed to know which skill would actually grow my shop. The plan pointed me to digital marketing.',
      outcome: 'Online orders up 3x after one course',
      avatar: 'https://images.pexels.com/photos/12871449/pexels-photo-12871449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      sort_order: 3,
    },
  ]);

  // ============ STEPS ============
  await Step.insertMany([
    { step: 1, label: 'Reach', title: 'We meet you where you are', detail: 'Free assessments, WhatsApp nudges, and local awareness drives bring career guidance to people who never had access to a counselor.', icon: 'radio', sort_order: 1 },
    { step: 2, label: 'Guide', title: 'A real plan, not a sales pitch', detail: 'Your assessment maps to 2–3 career tracks that fit your time, budget, and goals — guidance first, training later.', icon: 'compass', sort_order: 2 },
    { step: 3, label: 'Community', title: 'Learn with people like you', detail: 'Women-only cohorts, peer study circles, and mentor check-ins keep you accountable without feeling alone.', icon: 'users', sort_order: 3 },
    { step: 4, label: 'Training', title: 'Only when you are ready', detail: 'Once your path is clear, we connect you to the right short courses and internships — never the other way around.', icon: 'graduation-cap', sort_order: 4 },
  ]);

  // ============ STATS ============
  await Stat.insertMany([
    { value: '24', label: 'Active cities', sort_order: 1 },
    { value: '18,000+', label: 'Members guided', sort_order: 2 },
    { value: '320', label: 'Webinars delivered', sort_order: 3 },
  ]);

  // ============ MYTHS ============
  await Myth.insertMany([
    { myth: '"I need a degree to earn in tech."', truth: 'Most entry web and data roles care about your portfolio and a single project, not your degree.', sort_order: 1 },
    { myth: '"Freelancing is unstable and scary."', truth: 'One steady retainer client covers your basics. Most freelancers add a second only after that.', sort_order: 2 },
    { myth: '"It is too late to switch careers."', truth: "Our learners' average age is 29. Short courses and a clear plan make switching realistic in months, not years.", sort_order: 3 },
    { myth: '"Women-only batches are lower quality."', truth: 'Same curriculum, same mentors — just a safer space to ask questions and learn at your pace.', sort_order: 4 },
  ]);

  console.log('Seeding complete!');
  process.exit();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});