import { Post, PostType } from "@/types/post";

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

export const EXPLORE_POSTS: Post[] = [
  {
    id: "1",
    type: "text",
    content: "Exciting developments in #AI and #MachineLearning! 🤖",
    author: {
      name: "Tech Explorer",
      username: "techexplorer",
      avatarUrl: "https://api.randomx.ai/avatar/techexplorer",
    },
    createdAt: new Date(),
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
      avatarUrl: "https://api.randomx.ai/avatar/webwizard",
    },
    createdAt: new Date(),
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
