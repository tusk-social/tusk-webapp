import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Types
export type PostMedia = {
  url: string;
  type: "image" | "video" | "gif";
  width?: number;
  height?: number;
  alt?: string;
};

export type CreatePostData = {
  userId: string;
  text: string;
  media?: PostMedia[];
  parentPostId?: string;
  repostPostId?: string;
};

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    user: true;
    parentPost: {
      include: {
        user: true;
      };
    };
    repostPost: {
      include: {
        user: true;
      };
    };
    likes: {
      include: {
        user: true;
      };
    };
    bookmarks: true;
    mentions: {
      include: {
        mentionedUser: true;
      };
    };
    postHashtags: {
      include: {
        hashtag: true;
      };
    };
  };
}>;

export type TimelinePostsParams = {
  userId?: string;
  page?: number;
  limit?: number;
  type?: "all" | "replies" | "media";
  excludeReplies?: boolean;
};

export type UserPostsParams = {
  username: string;
  page?: number;
  limit?: number;
  type?: "all" | "replies" | "media";
};

// Helper functions
function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // remove any trailing non-alphanumeric and non-underscore characters
    const username = match[1].replace(/[^a-zA-Z0-9_]/g, "");
    mentions.push(username);
  }

  return [...new Set(mentions)]; // remove duplicates
}

function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    // remove any trailing non-alphanumeric and non-underscore characters
    const hashtag = match[1].replace(/[^a-zA-Z0-9_]/g, "");
    hashtags.push(hashtag);
  }

  return [...new Set(hashtags)]; // remove duplicates
}

// Post Service
export const postService = {
  // Create a new post
  async createPost(data: CreatePostData): Promise<PostWithRelations> {
    const { userId, text, media, parentPostId, repostPostId } = data;

    // Extract mentions and hashtags
    const mentionUsernames = extractMentions(text);
    const hashtagTexts = extractHashtags(text);

    // Create the post
    const post = await prisma.post.create({
      data: {
        userId,
        text,
        media: media ? (JSON.stringify(media) as any) : undefined,
        parentPostId,
        repostPostId,
      },
      include: {
        user: true,
        parentPost: {
          include: {
            user: true,
          },
        },
        repostPost: {
          include: {
            user: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        bookmarks: true,
        mentions: {
          include: {
            mentionedUser: true,
          },
        },
        postHashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });

    // Process mentions
    if (mentionUsernames.length > 0) {
      // Find mentioned users
      const mentionedUsers = await prisma.user.findMany({
        where: {
          username: {
            in: mentionUsernames,
          },
        },
      });

      // Create mention records
      for (const user of mentionedUsers) {
        await prisma.mention.create({
          data: {
            postId: post.id,
            mentionedUserId: user.id,
          },
        });
      }
    }

    // Process hashtags
    if (hashtagTexts.length > 0) {
      for (const hashtagText of hashtagTexts) {
        // Find or create hashtag
        const hashtag = await prisma.hashtag.upsert({
          where: { hashtag: hashtagText },
          update: {},
          create: { hashtag: hashtagText },
        });

        // Create post-hashtag association
        await prisma.postHashtag.create({
          data: {
            postId: post.id,
            hashtagId: hashtag.id,
          },
        });
      }
    }

    // Update parent post reply count if this is a reply
    if (parentPostId) {
      await prisma.post.update({
        where: { id: parentPostId },
        data: { replyCount: { increment: 1 } },
      });
    }

    // Update original post repost count if this is a repost
    if (repostPostId) {
      await prisma.post.update({
        where: { id: repostPostId },
        data: { repostCount: { increment: 1 } },
      });
    }

    // Fetch the post with all relations after creating mentions and hashtags
    return prisma.post.findUnique({
      where: { id: post.id },
      include: {
        user: true,
        parentPost: {
          include: {
            user: true,
          },
        },
        repostPost: {
          include: {
            user: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        bookmarks: true,
        mentions: {
          include: {
            mentionedUser: true,
          },
        },
        postHashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    }) as Promise<PostWithRelations>;
  },

  // Helper function to parse media field
  parsePostMedia(post: any): any {
    if (!post) return post;

    // Parse media if it's a string
    if (post.media && typeof post.media === "string") {
      try {
        post.media = JSON.parse(post.media);
      } catch (e) {
        console.error("Error parsing post media:", e);
      }
    }

    // Parse media in related posts
    if (post.parentPost) {
      this.parsePostMedia(post.parentPost);
    }

    if (post.repostPost) {
      this.parsePostMedia(post.repostPost);
    }

    return post;
  },

  // Get a single post by ID
  async getPostById(id: string): Promise<PostWithRelations | null> {
    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: true,
        parentPost: {
          include: {
            user: true,
          },
        },
        repostPost: {
          include: {
            user: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        bookmarks: true,
        mentions: {
          include: {
            mentionedUser: true,
          },
        },
        postHashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });

    return this.parsePostMedia(post);
  },

  // Get posts for a user's timeline
  async getTimelinePosts({
    userId,
    page = 1,
    limit = 20,
    type = "all",
    excludeReplies = false,
  }: TimelinePostsParams): Promise<{
    posts: PostWithRelations[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const where: Prisma.PostWhereInput = {
      deletedAt: null,
    };

    // Filter by type
    if (type === "replies") {
      where.parentPostId = { not: null };
    } else if (type === "media") {
      where.media = { not: Prisma.JsonNull };
    }

    // Exclude replies if requested
    if (excludeReplies) {
      where.parentPostId = null;
    }

    // If userId is provided, get posts from followed users and the user's own posts
    if (userId) {
      const followedUsers = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followedId: true },
      });

      const followedUserIds = followedUsers.map((follow) => follow.followedId);

      where.OR = [
        { userId: { in: [...followedUserIds, userId] } },
        { mentions: { some: { mentionedUserId: userId } } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: true,
          parentPost: {
            include: {
              user: true,
            },
          },
          repostPost: {
            include: {
              user: true,
            },
          },
          likes: {
            include: {
              user: true,
            },
          },
          bookmarks: true,
          mentions: {
            include: {
              mentionedUser: true,
            },
          },
          postHashtags: {
            include: {
              hashtag: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // Parse media for each post
    const parsedPosts = posts.map((post) => this.parsePostMedia(post));

    return {
      posts: parsedPosts,
      total,
    };
  },

  // Get posts by a specific user
  async getUserPosts({
    username,
    page = 1,
    limit = 20,
    type = "all",
  }: UserPostsParams): Promise<{
    posts: PostWithRelations[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    // Get user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { posts: [], total: 0 };
    }

    const where: Prisma.PostWhereInput = {
      userId: user.id,
      deletedAt: null,
    };

    // Filter by type
    if (type === "replies") {
      where.parentPostId = { not: null };
    } else if (type === "media") {
      where.media = { not: Prisma.JsonNull };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: true,
          parentPost: {
            include: {
              user: true,
            },
          },
          repostPost: {
            include: {
              user: true,
            },
          },
          likes: {
            include: {
              user: true,
            },
          },
          bookmarks: true,
          mentions: {
            include: {
              mentionedUser: true,
            },
          },
          postHashtags: {
            include: {
              hashtag: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // Parse media for each post
    const parsedPosts = posts.map((post) => this.parsePostMedia(post));

    return { posts: parsedPosts, total };
  },

  // Like a post
  async likePost(userId: string, postId: string): Promise<void> {
    // Check if the like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return; // Like already exists
    }

    // Create the like and update the post's like count
    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId,
          postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
  },

  // Unlike a post
  async unlikePost(userId: string, postId: string): Promise<void> {
    // Check if the like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      return; // Like doesn't exist
    }

    // Delete the like and update the post's like count
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
  },

  // Bookmark a post
  async bookmarkPost(userId: string, postId: string): Promise<void> {
    // Check if the bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
      return; // Bookmark already exists
    }

    // Create the bookmark and update the post's bookmark count
    await prisma.$transaction([
      prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { bookmarkCount: { increment: 1 } },
      }),
    ]);
  },

  // Remove a bookmark
  async unbookmarkPost(userId: string, postId: string): Promise<void> {
    // Check if the bookmark exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingBookmark) {
      return; // Bookmark doesn't exist
    }

    // Delete the bookmark and update the post's bookmark count
    await prisma.$transaction([
      prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { bookmarkCount: { decrement: 1 } },
      }),
    ]);
  },

  // Create a reply to a post
  async createReply(data: CreatePostData): Promise<PostWithRelations> {
    if (!data.parentPostId) {
      throw new Error("Parent post ID is required for a reply");
    }

    return this.createPost(data);
  },

  // Create a repost
  async createRepost(data: CreatePostData): Promise<PostWithRelations> {
    if (!data.repostPostId) {
      throw new Error("Original post ID is required for a repost");
    }

    return this.createPost(data);
  },

  // Delete a post (soft delete)
  async deletePost(id: string): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  // Get posts with a specific hashtag
  async getPostsByHashtag(
    hashtag: string,
    page = 1,
    limit = 20,
  ): Promise<{
    posts: PostWithRelations[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      postHashtags: {
        some: {
          hashtag: {
            hashtag,
          },
        },
      },
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: true,
          parentPost: {
            include: {
              user: true,
            },
          },
          repostPost: {
            include: {
              user: true,
            },
          },
          likes: {
            include: {
              user: true,
            },
          },
          bookmarks: true,
          mentions: {
            include: {
              mentionedUser: true,
            },
          },
          postHashtags: {
            include: {
              hashtag: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  },

  async getPostReplies(
    postId: string,
    page = 1,
    limit = 10,
  ): Promise<PostWithRelations[]> {
    const skip = (page - 1) * limit;

    const replies = await prisma.post.findMany({
      where: {
        parentPostId: postId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: true,
        parentPost: {
          include: {
            user: true,
          },
        },
        repostPost: {
          include: {
            user: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        bookmarks: true,
        mentions: {
          include: {
            mentionedUser: true,
          },
        },
        postHashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });

    return replies;
  },

  // Count replies for a specific post
  async getPostRepliesCount(postId: string): Promise<number> {
    const count = await prisma.post.count({
      where: {
        parentPostId: postId,
      },
    });
    return count;
  },

  // Get bookmarked posts for a user
  async getBookmarkedPosts(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    posts: PostWithRelations[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    // Get bookmarks for the user
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          include: {
            user: true,
            parentPost: {
              include: {
                user: true,
              },
            },
            repostPost: {
              include: {
                user: true,
              },
            },
            likes: {
              include: {
                user: true,
              },
            },
            bookmarks: true,
            mentions: {
              include: {
                mentionedUser: true,
              },
            },
            postHashtags: {
              include: {
                hashtag: true,
              },
            },
          },
        },
      },
    });

    // Extract posts from bookmarks
    const posts = bookmarks.map((bookmark) => {
      const post = bookmark.post;

      // Parse media if it's a string
      this.parsePostMedia(post);

      // Add isBookmarked flag
      return {
        ...post,
        isBookmarked: true,
      };
    }) as PostWithRelations[];

    // Get total count
    const total = await prisma.bookmark.count({
      where: {
        userId,
      },
    });

    return {
      posts,
      total,
    };
  },
};
