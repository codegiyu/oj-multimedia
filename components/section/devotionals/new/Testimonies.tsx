'use client';

import { Star, Heart, Play, Calendar, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useRef } from 'react';

const testimonies = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    title: 'Healed from Chronic Illness',
    excerpt:
      'After years of struggling with a chronic condition, God completely healed me. This testimony is a reminder that nothing is impossible with God. His healing power is real and available to all who believe.',
    fullStory:
      'I had been battling a chronic illness for over five years. Doctors had given up hope, but I never stopped praying. One day during prayer, I felt a warmth spread through my body, and I knew I was healed. Today, I am completely free from that condition, and I give all glory to God.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop',
    date: '2 weeks ago',
    category: 'Healing',
    rating: 5,
    hasVideo: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'California, USA',
    title: 'Financial Breakthrough',
    excerpt:
      'God provided in ways I never imagined. From being in debt to becoming debt-free, His faithfulness never ceases to amaze me. He truly is Jehovah Jireh, our provider.',
    fullStory:
      'I was drowning in debt, struggling to make ends meet. I cried out to God, and He began opening doors I never expected. Opportunities came, and within a year, I was completely debt-free. God is faithful to His promises.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
    date: '1 month ago',
    category: 'Provision',
    rating: 5,
    hasVideo: false,
  },
  {
    id: 3,
    name: 'Grace Okonkwo',
    location: 'Lagos, Nigeria',
    title: 'Restored Marriage',
    excerpt:
      "Our marriage was on the brink of collapse, but through prayer and God's intervention, we found restoration and renewed love. God can restore what seems broken beyond repair.",
    fullStory:
      "My husband and I were ready to file for divorce. We had tried everything, but nothing worked. Then we decided to seek God together. Through counseling, prayer, and God's grace, our marriage was not just saved but transformed into something more beautiful than before.",
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop',
    date: '3 weeks ago',
    category: 'Marriage',
    rating: 5,
    hasVideo: true,
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'London, UK',
    title: 'Career Transformation',
    excerpt:
      "After losing my job, I trusted God and He opened doors I never expected. Today I'm in a position I could only dream of. God's plans are always better than ours.",
    fullStory:
      'Losing my job felt like the end of the world. But God had a better plan. After months of prayer and trusting Him, I received a job offer that was beyond my qualifications and expectations. God truly works all things together for good.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop',
    date: '2 months ago',
    category: 'Career',
    rating: 5,
    hasVideo: false,
  },
  {
    id: 5,
    name: 'Maria Rodriguez',
    location: 'Texas, USA',
    title: 'Delivered from Addiction',
    excerpt:
      "God set me free from a 10-year addiction. His grace and power transformed my life completely. I'm now living in freedom and helping others find the same freedom in Christ.",
    fullStory:
      'Addiction had control of my life for a decade. I tried everything to break free, but nothing worked until I surrendered to Jesus. His power broke every chain, and today I am free, serving God and helping others find freedom.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop',
    date: '1 week ago',
    category: 'Deliverance',
    rating: 5,
    hasVideo: true,
  },
  {
    id: 6,
    name: 'James Wilson',
    location: 'Sydney, Australia',
    title: 'Finding Purpose',
    excerpt:
      "I was lost and directionless until I encountered God. Now I know my purpose and I'm living it out with passion and joy. God gives meaning to every life.",
    fullStory:
      "I spent years searching for meaning and purpose. Nothing satisfied until I met Jesus. He revealed my purpose and gave me a passion to serve others. Now I wake up every day with joy, knowing I am fulfilling God's plan for my life.",
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop',
    date: '3 months ago',
    category: 'Purpose',
    rating: 5,
    hasVideo: false,
  },
];

export const Testimonies = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      <div className="regular-container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Testimonies</h2>
              <p className="text-muted-foreground">Stories of God's faithfulness</p>
            </div>
          </div>
          <Button variant="outline">View All Testimonies</Button>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 8000,
              disableOnInteraction: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-primary/30',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
            }}
            navigation={{
              prevEl: '.testimonies-prev',
              nextEl: '.testimonies-next',
            }}
            onSwiper={swiper => {
              swiperRef.current = swiper;
            }}
            className="testimonies-swiper">
            {testimonies.map(testimony => (
              <SwiperSlide key={testimony.id}>
                <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl overflow-hidden border border-border/50 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative aspect-square md:aspect-auto md:h-[500px] overflow-hidden">
                      <img
                        src={testimony.image}
                        alt={testimony.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      {testimony.hasVideo && (
                        <div className="absolute top-6 right-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      )}
                      <div className="absolute bottom-6 left-6 right-6">
                        <Badge className="bg-primary/90 text-primary-foreground mb-3">
                          {testimony.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(testimony.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 flex flex-col justify-center relative">
                      <Quote className="absolute top-8 right-8 w-16 h-16 text-primary/10" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="relative">
                            <img
                              src={testimony.image}
                              alt={testimony.name}
                              className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-foreground">{testimony.name}</h3>
                            <p className="text-sm text-muted-foreground">{testimony.location}</p>
                          </div>
                        </div>

                        <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                          {testimony.title}
                        </h4>

                        <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                          {testimony.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-border">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {testimony.date}
                          </span>
                          <Button variant="default" size="lg" className="group">
                            Read Full Story
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            className="testimonies-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-colors border border-border/50"
            aria-label="Previous testimony">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            className="testimonies-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-colors border border-border/50"
            aria-label="Next testimony">
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};
