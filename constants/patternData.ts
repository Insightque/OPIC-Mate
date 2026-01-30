import { StructureItem } from "../types";

export const OPIC_PATTERN_DB: StructureItem[] = [
  // 1. Openers
  { 
    korean: "제가 ~에 대해 말씀드리고 싶은 것은...", 
    english: "What I'd like to tell you about is...",
    samples: [
      { korean: "제가 말씀드리고 싶은 것은 제 가장 좋아하는 공원입니다.", english: "What I'd like to tell you about is my favorite park." },
      { korean: "제가 말씀드리고 싶은 것은 저의 기억에 남는 여행입니다.", english: "What I'd like to tell you about is my memorable trip." },
      { korean: "제가 말씀드리고 싶은 것은 제 어릴 적 집입니다.", english: "What I'd like to tell you about is my childhood home." }
    ]
  },
  { 
    korean: "~에 관해서라면,", 
    english: "When it comes to...",
    samples: [
      { korean: "음악에 관해서라면, 저는 힙합을 선호합니다.", english: "When it comes to music, I prefer hip-hop." },
      { korean: "재활용에 관해서라면, 한국은 매우 엄격합니다.", english: "When it comes to recycling, Korea is very strict." },
      { korean: "집안일에 관해서라면, 저는 설거지 담당입니다.", english: "When it comes to housework, I am in charge of doing the dishes." }
    ]
  },
  { 
    korean: "사실, 저는 ~에 대해 생각해 본 적이 별로 없지만,", 
    english: "Actually, I haven't thought much about..., but",
    samples: [
      { korean: "사실, 저는 그 문제에 대해 생각해 본 적이 별로 없지만...", english: "Actually, I haven't thought much about that issue, but..." },
      { korean: "사실, 저는 가구에 대해 생각해 본 적이 별로 없지만...", english: "Actually, I haven't thought much about furniture, but..." },
      { korean: "사실, 저는 이웃에 대해 생각해 본 적이 별로 없지만...", english: "Actually, I haven't thought much about my neighbors, but..." }
    ]
  },
  { 
    korean: "가장 먼저 떠오르는 것은 ~입니다.", 
    english: "The first thing that comes to mind is...",
    samples: [
      { korean: "가장 먼저 떠오르는 것은 한강 공원입니다.", english: "The first thing that comes to mind is Han River Park." },
      { korean: "당신이 그 질문을 했을 때 가장 먼저 떠오르는 것은 제 첫 직장입니다.", english: "When you ask that question, the first thing that comes to mind is my first job." },
      { korean: "가장 먼저 떠오르는 것은 맛있는 길거리 음식입니다.", english: "The first thing that comes to mind is delicious street food." }
    ]
  },
  { 
    korean: "제가 가장 좋아하는 ~은 단연코 ...입니다.", 
    english: "My favorite ... is definitely...",
    samples: [
      { korean: "제가 가장 좋아하는 가수는 단연코 아이유입니다.", english: "My favorite singer is definitely IU." },
      { korean: "제가 가장 좋아하는 영화 장르는 단연코 액션입니다.", english: "My favorite movie genre is definitely action." },
      { korean: "제가 가장 좋아하는 방은 단연코 제 침실입니다.", english: "My favorite room is definitely my bedroom." }
    ]
  },

  // 2. Habits
  { 
    korean: "저는 보통 주말에 ~하러 갑니다.", 
    english: "I usually go to ... on weekends.",
    samples: [
      { korean: "저는 보통 주말에 영화를 보러 영화관에 갑니다.", english: "I usually go to the movie theater on weekends." },
      { korean: "저는 보통 주말에 커피를 마시러 카페에 갑니다.", english: "I usually go to a cafe to drink coffee on weekends." },
      { korean: "저는 보통 주말에 부모님 댁에 갑니다.", english: "I usually go to my parents' house on weekends." }
    ]
  },
  { 
    korean: "저는 틈날 때마다 ~하려고 노력합니다.", 
    english: "I try to ... whenever I have free time.",
    samples: [
      { korean: "저는 틈날 때마다 조깅을 하려고 노력합니다.", english: "I try to go jogging whenever I have free time." },
      { korean: "저는 틈날 때마다 영어 공부를 하려고 노력합니다.", english: "I try to study English whenever I have free time." },
      { korean: "저는 틈날 때마다 집을 청소하려고 노력합니다.", english: "I try to clean my house whenever I have free time." }
    ]
  },
  { 
    korean: "저는 ~하는 습관이 있습니다.", 
    english: "I have a habit of -ing...",
    samples: [
      { korean: "저는 잠자리에 들기 전에 뉴스를 확인하는 습관이 있습니다.", english: "I have a habit of checking the news before going to bed." },
      { korean: "저는 아침에 스트레칭을 하는 습관이 있습니다.", english: "I have a habit of stretching in the morning." },
      { korean: "저는 식사 후에 물을 마시는 습관이 있습니다.", english: "I have a habit of drinking water after meals." }
    ]
  },

  // 3. Past Experiences
  { 
    korean: "몇 년 전에 ~에 갔던 기억이 납니다.", 
    english: "I remember going to ... a few years ago.",
    samples: [
      { korean: "몇 년 전에 제주도에 갔던 기억이 납니다.", english: "I remember going to Jeju Island a few years ago." },
      { korean: "몇 년 전에 라이브 콘서트에 갔던 기억이 납니다.", english: "I remember going to a live concert a few years ago." },
      { korean: "몇 년 전에 해변에 갔던 기억이 납니다.", english: "I remember going to the beach a few years ago." }
    ]
  },
  { 
    korean: "가장 기억에 남는 것은...", 
    english: "What I remember most is...",
    samples: [
      { korean: "가장 기억에 남는 것은 아름다운 야경이었습니다.", english: "What I remember most is the beautiful night view." },
      { korean: "가장 기억에 남는 것은 친절한 현지 사람들이었습니다.", english: "What I remember most is the friendly local people." },
      { korean: "가장 기억에 남는 것은 끔찍한 날씨였습니다.", english: "What I remember most is the terrible weather." }
    ]
  },
  { 
    korean: "그 경험은 저에게 큰 영향을 미쳤습니다.", 
    english: "The experience had a huge impact on me.",
    samples: [
      { korean: "해외에서 공부한 경험은 저에게 큰 영향을 미쳤습니다.", english: "Studying abroad had a huge impact on me." },
      { korean: "그 자원봉사 경험은 저에게 큰 영향을 미쳤습니다.", english: "The volunteering experience had a huge impact on me." },
      { korean: "그 사고는 저에게 큰 영향을 미쳤습니다.", english: "The accident had a huge impact on me." }
    ]
  },

  // 4. Feelings & Opinions
  { 
    korean: "그것이 제가 ~을 좋아하는 주된 이유입니다.", 
    english: "That is the main reason why I like...",
    samples: [
      { korean: "그것이 제가 요리를 좋아하는 주된 이유입니다.", english: "That is the main reason why I like cooking." },
      { korean: "그것이 제가 이 공원을 좋아하는 주된 이유입니다.", english: "That is the main reason why I like this park." },
      { korean: "그것이 제가 대중교통을 좋아하는 주된 이유입니다.", english: "That is the main reason why I like public transportation." }
    ]
  },
  { 
    korean: "저는 ~가 매우 편리하다고 생각합니다.", 
    english: "I find ... very convenient.",
    samples: [
      { korean: "저는 배달 앱이 매우 편리하다고 생각합니다.", english: "I find delivery apps very convenient." },
      { korean: "저는 지하철 시스템이 매우 편리하다고 생각합니다.", english: "I find the subway system very convenient." },
      { korean: "저는 온라인 쇼핑이 매우 편리하다고 생각합니다.", english: "I find online shopping very convenient." }
    ]
  },
  { 
    korean: "가성비가 좋습니다.", 
    english: "It is good value for money.",
    samples: [
      { korean: "이 식당은 가성비가 좋습니다.", english: "This restaurant is good value for money." },
      { korean: "그 호텔은 비싸지 않고 가성비가 좋았습니다.", english: "The hotel was not expensive and was good value for money." },
      { korean: "새 노트북은 가성비가 정말 좋습니다.", english: "The new laptop is really good value for money." }
    ]
  },

  // 5. Comparisons
  { 
    korean: "과거에 비해, ~은 많이 변했습니다.", 
    english: "Compared to the past, ... has changed a lot.",
    samples: [
      { korean: "과거에 비해, 우리 동네는 많이 변했습니다.", english: "Compared to the past, my neighborhood has changed a lot." },
      { korean: "과거에 비해, 기술은 많이 변했습니다.", english: "Compared to the past, technology has changed a lot." },
      { korean: "과거에 비해, 사람들의 생활 방식은 많이 변했습니다.", english: "Compared to the past, people's lifestyles have changed a lot." }
    ]
  },
  { 
    korean: "가장 큰 차이점은 ~입니다.", 
    english: "The biggest difference is...",
    samples: [
      { korean: "가장 큰 차이점은 화면 크기입니다.", english: "The biggest difference is the screen size." },
      { korean: "가장 큰 차이점은 편의성입니다.", english: "The biggest difference is convenience." },
      { korean: "전통 시장과 대형 마트의 가장 큰 차이점은 가격입니다.", english: "The biggest difference between traditional markets and hypermarkets is the price." }
    ]
  },
  
  // 6. Hypotheticals
  { 
    korean: "만약 제가 ~라면, 저는 ...할 것입니다.", 
    english: "If I were ..., I would...",
    samples: [
      { korean: "만약 제가 당신이라면, 저는 사과할 것입니다.", english: "If I were you, I would apologize." },
      { korean: "만약 제가 휴가를 간다면, 저는 해변으로 갈 것입니다.", english: "If I were on vacation, I would go to the beach." },
      { korean: "만약 제가 부자라면, 저는 세계 여행을 할 것입니다.", english: "If I were rich, I would travel the world." }
    ]
  },
  { 
    korean: "제가 ~해도 괜찮을까요?", 
    english: "Would it be okay if I...?",
    samples: [
      { korean: "제가 다른 테이블로 옮겨도 괜찮을까요?", english: "Would it be okay if I moved to another table?" },
      { korean: "제가 환불을 받아도 괜찮을까요?", english: "Would it be okay if I got a refund?" },
      { korean: "제가 친구를 데려와도 괜찮을까요?", english: "Would it be okay if I brought a friend?" }
    ]
  },

  // 7. Problem Solving
  { 
    korean: "문제가 생겼습니다.", 
    english: "There is a problem with...",
    samples: [
      { korean: "제가 산 티켓에 문제가 생겼습니다.", english: "There is a problem with the ticket I bought." },
      { korean: "제 예약에 문제가 생겼습니다.", english: "There is a problem with my reservation." },
      { korean: "에어컨에 문제가 생겼습니다.", english: "There is a problem with the air conditioner." }
    ]
  },
  { 
    korean: "어떻게 해야 할지 모르겠습니다.", 
    english: "I don't know what to do.",
    samples: [
      { korean: "지갑을 잃어버려서 어떻게 해야 할지 모르겠습니다.", english: "I lost my wallet, so I don't know what to do." },
      { korean: "너무 당황해서 어떻게 해야 할지 모르겠습니다.", english: "I am so panic, I don't know what to do." },
      { korean: "그것이 작동하지 않아서 어떻게 해야 할지 모르겠습니다.", english: "It's not working, so I don't know what to do." }
    ]
  }
];