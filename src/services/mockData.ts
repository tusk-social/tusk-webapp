import { Post, PostType } from "@/types/post";

export const SAMPLE_POST: Post = {
  id: "1",
  type: "text",
  content: `Just launched Tusk - a modern Twitter alternative! 🚀\n\n  Built with @chopinframework and @celestia, for #Mammothon. What do you think?\n  `,
  author: {
    name: "John Doe",
    username: "johndoe",
    avatar: "https://api.randomx.ai/avatar/johndoe",
  },
  createdAt: "2h",
  stats: {
    replies: 42,
    reposts: 128,
    likes: 500,
    views: 10000,
  },
  isBookmarked: false,
  comments: [
    {
      id: "comment1",
      type: "text" as PostType,
      content: "This is amazing! Looking forward to using it. 🎉",
      author: {
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://api.randomx.ai/avatar/janesmith",
      },
      createdAt: "1h",
      stats: {
        replies: 2,
        reposts: 1,
        likes: 15,
        views: 100,
      },
    },
    {
      id: "comment2",
      type: "text" as PostType,
      content:
        "Great work! The UI looks really clean. How long did it take to build?",
      author: {
        name: "Tech Enthusiast",
        username: "techlover",
        avatar: "https://api.randomx.ai/avatar/techlover",
      },
      createdAt: "30m",
      stats: {
        replies: 1,
        reposts: 0,
        likes: 8,
        views: 50,
      },
    },
  ],
};

export const SAMPLE_NOTIFICATIONS = [
  {
    id: "1",
    type: "like",
    isRead: false,
    createdAt: "2h",
    actor: {
      name: "John Doe",
      username: "johndoe",
      avatar: "https://api.randomx.ai/avatar/currentuser",
    },
    post: {
      id: "1",
      content: "This is an amazing post!",
    },
  },
  {
    id: "4",
    type: "mention",
    isRead: true,
    createdAt: "2d",
    actor: {
      name: "Product Guru",
      username: "prodguru",
      avatar: "https://api.randomx.ai/avatar/currentuser",
    },
    post: {
      id: "4",
      content: "Hey @username, what do you think about this?",
    },
  },
];

export const SAMPLE_BOOKMARKS: Post[] = [
  {
    id: "1",
    type: "text",
    content: "This is a bookmarked post about #coding and #webdev",
    author: {
      name: "Tech Enthusiast",
      username: "techlover",
      avatar: "https://api.randomx.ai/avatar/techlover",
    },
    createdAt: "2h",
    stats: {
      replies: 12,
      reposts: 5,
      likes: 28,
      views: 1240,
    },
    isBookmarked: true,
  },
  {
    id: "2",
    type: "image",
    content: "Saved this amazing design inspiration for later! 🎨",
    author: {
      name: "Design Master",
      username: "designpro",
      avatar: "https://api.randomx.ai/avatar/designpro",
    },
    createdAt: "5h",
    images: [
      "https://newatlas-brightspot.s3.amazonaws.com/58/9e/def2b10348ad8512822a2679a30d/mammoth.jpg",
    ],
    stats: {
      replies: 8,
      reposts: 15,
      likes: 122,
      views: 1800,
    },
    isBookmarked: true,
  },
];

export const MOCK_USER = {
  name: "John Doe",
  username: "johndoe",
  avatar: "https://api.randomx.ai/avatar/johndoe",
  banner: "/banners/default.jpg",
  bio: "Software engineer by day, dreamer by night 💫\nBuilding the future, one line of code at a time.",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  joinedDate: "March 2024",
  following: 420,
  followers: 69,
};

export const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    type: "text",
    content: `Just launched Tusk - a modern Twitter alternative! 🚀\n\nBuilt with @chopinframework and @celestia, for #Mammothon. What do you think?`,
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: "https://api.randomx.ai/avatar/johndoe",
    },
    createdAt: "2h",
    stats: {
      replies: 12,
      reposts: 5,
      likes: 28,
      views: 1240,
    },
  },
  {
    id: "2",
    type: "image",
    content: "Check out these amazing photos from my trip! 📸",
    author: {
      name: "Travel Enthusiast",
      username: "traveler",
      avatar: "https://api.randomx.ai/avatar/traveler",
    },
    createdAt: "4h",
    images: [
      "https://newatlas-brightspot.s3.amazonaws.com/58/9e/def2b10348ad8512822a2679a30d/mammoth.jpg",
      "https://newatlas-brightspot.s3.amazonaws.com/58/9e/def2b10348ad8512822a2679a30d/mammoth.jpg",
      "https://newatlas-brightspot.s3.amazonaws.com/58/9e/def2b10348ad8512822a2679a30d/mammoth.jpg",
    ],
    stats: {
      replies: 45,
      reposts: 122,
      likes: 1200,
      views: 15400,
    },
  },
];

export const SAMPLE_COMMENTS = new Map<string, Post[]>();

export const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    type: "text",
    content: `Just launched Tusk - a modern Twitter alternative! 🚀\n\nBuilt with @chopinframework and @celestia, for #Mammothon. What do you think? #webdev`,
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: "https://api.randomx.ai/avatar/johndoe",
    },
    createdAt: "2h",
    stats: {
      replies: 12,
      reposts: 5,
      likes: 28,
      views: 1240,
    },
  },
  // ... other initial posts
];

export const EXPLORE_POSTS: Post[] = [
  {
    id: "1",
    type: "text",
    content: "Exciting developments in #AI and #MachineLearning! 🤖",
    author: {
      name: "Tech Explorer",
      username: "techexplorer",
      avatar: "https://api.randomx.ai/avatar/techexplorer",
    },
    createdAt: "2h",
    stats: {
      replies: 45,
      reposts: 120,
      likes: 850,
      views: 12400,
    },
  },
  {
    id: "2",
    type: "image",
    content:
      "The future of web development is here! Check out these amazing tools 🚀 #webdev #coding",
    author: {
      name: "Web Wizard",
      username: "webwizard",
      avatar: "https://api.randomx.ai/avatar/webwizard",
    },
    createdAt: "5h",
    images: [
      "https://newatlas-brightspot.s3.amazonaws.com/58/9e/def2b10348ad8512822a2679a30d/mammoth.jpg",
    ],
    stats: {
      replies: 28,
      reposts: 75,
      likes: 420,
      views: 8900,
    },
  },
];

export const WHO_TO_FOLLOW = [
  {
    id: 1,
    name: "User One",
    username: "userone",
    avatar: "https://api.randomx.ai/avatar/user1",
  },
  {
    id: 2,
    name: "User Two",
    username: "usertwo",
    avatar: "https://api.randomx.ai/avatar/user2",
  },
  {
    id: 3,
    name: "User Three",
    username: "userthree",
    avatar: "https://api.randomx.ai/avatar/user3",
  },
];

export const TRENDING_TOPICS = [
  {
    topic: "Technology",
    posts: "125.4K",
    hashtag: "#tech",
  },
  {
    topic: "Web Development",
    posts: "85.2K",
    hashtag: "#webdev",
  },
  {
    topic: "Artificial Intelligence",
    posts: "92.1K",
    hashtag: "#AI",
  },
  {
    topic: "Open Source",
    posts: "45.6K",
    hashtag: "#opensource",
  },
];

export const USERS_LIST = [
  {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    avatar: "https://api.randomx.ai/avatar/johndoe",
    bio: "Software engineer by day, dreamer by night 💫",
  },
  {
    id: "2",
    name: "Jane Smith",
    username: "janesmith",
    avatar: "https://api.randomx.ai/avatar/janesmith",
    bio: "UX/UI Designer | Creating beautiful experiences",
  },
  {
    id: "3",
    name: "Tech Enthusiast",
    username: "techlover",
    avatar: "https://api.randomx.ai/avatar/techlover",
    bio: "Always exploring the latest in tech",
  },
  {
    id: "4",
    name: "Design Master",
    username: "designpro",
    avatar: "https://api.randomx.ai/avatar/designpro",
    bio: "Making the world more beautiful, one pixel at a time",
  },
  {
    id: "5",
    name: "Travel Enthusiast",
    username: "traveler",
    avatar: "https://api.randomx.ai/avatar/traveler",
    bio: "Exploring the world, one country at a time ✈️",
  },
  {
    id: "6",
    name: "Web Wizard",
    username: "webwizard",
    avatar: "https://api.randomx.ai/avatar/webwizard",
    bio: "Full-stack developer | Open source contributor",
  },
  {
    id: "7",
    name: "Tech Explorer",
    username: "techexplorer",
    avatar: "https://api.randomx.ai/avatar/techexplorer",
    bio: "Exploring the frontiers of technology",
  },
  {
    id: "8",
    name: "Product Guru",
    username: "prodguru",
    avatar: "https://api.randomx.ai/avatar/prodguru",
    bio: "Building products people love",
  },
  {
    id: "9",
    name: "Code Ninja",
    username: "codeninja",
    avatar: "https://api.randomx.ai/avatar/codeninja",
    bio: "Slicing through complex problems with elegant code",
  },
  {
    id: "10",
    name: "AI Researcher",
    username: "airesearcher",
    avatar: "https://api.randomx.ai/avatar/airesearcher",
    bio: "Pushing the boundaries of artificial intelligence",
  },
];
