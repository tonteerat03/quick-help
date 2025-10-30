export const COMMENT_DATA = [
  {
    id: 1,
    manualId: 1,
    userId: 2,
    username: "john_doe",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    content:
      "This is an excellent guide! The examples are clear and easy to follow. I've been using React for 2 years and still learned new things from this manual.",
    rating: 5,
    createdAt: "2025-10-21T09:15:00Z",
    isEdited: false,
    likes: 12,
    replies: [
      {
        id: 1,
        userId: 1,
        username: "admin",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        content: "Thank you for the feedback! I'm glad you found it helpful.",
        createdAt: "2025-10-21T10:30:00Z",
        isEdited: false,
      },
    ],
  },
  {
    id: 2,
    manualId: 1,
    userId: 3,
    username: "sarah_dev",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    content:
      "Great manual! Could you add a section about testing React components? That would make it even more complete.",
    rating: 4,
    createdAt: "2025-10-22T14:45:00Z",
    isEdited: false,
    likes: 8,
    replies: [],
  },
  {
    id: 3,
    manualId: 3,
    userId: 2,
    username: "john_doe",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    content:
      "The UI/UX principles explained here are spot on! I've shared this with my design team and everyone loves it.",
    rating: 5,
    createdAt: "2025-10-25T11:20:00Z",
    isEdited: false,
    likes: 15,
    replies: [],
  },
  {
    id: 4,
    manualId: 6,
    userId: 3,
    username: "sarah_dev",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    content:
      "This DevOps guide saved me hours of research! The Docker and Kubernetes sections are particularly well explained.",
    rating: 5,
    createdAt: "2025-10-26T16:10:00Z",
    isEdited: false,
    likes: 22,
    replies: [],
  },
  {
    id: 5,
    manualId: 2,
    userId: 2,
    username: "john_doe",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    content:
      "As a project manager, I can confirm this manual covers all the essential aspects. The agile methodology section is particularly useful.",
    rating: 4,
    createdAt: "2025-10-28T08:30:00Z",
    isEdited: false,
    likes: 6,
    replies: [],
  },
];

// Helper functions for comment management
export const getCommentsByManualId = (manualId) => {
  return COMMENT_DATA.filter(
    (comment) => comment.manualId === parseInt(manualId)
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const addComment = (commentData) => {
  const newId =
    COMMENT_DATA.length > 0
      ? Math.max(...COMMENT_DATA.map((c) => c.id)) + 1
      : 1;
  const newComment = {
    id: newId,
    ...commentData,
    createdAt: new Date().toISOString(),
    isEdited: false,
    likes: 0,
    replies: [],
  };
  COMMENT_DATA.push(newComment);
  return newComment;
};

export const addReply = (commentId, replyData) => {
  const comment = COMMENT_DATA.find((c) => c.id === commentId);
  if (comment) {
    const newReplyId =
      comment.replies.length > 0
        ? Math.max(...comment.replies.map((r) => r.id)) + 1
        : 1;
    const newReply = {
      id: newReplyId,
      ...replyData,
      createdAt: new Date().toISOString(),
      isEdited: false,
    };
    comment.replies.push(newReply);
    return newReply;
  }
  return null;
};

export const likeComment = (commentId) => {
  const comment = COMMENT_DATA.find((c) => c.id === commentId);
  if (comment) {
    comment.likes += 1;
    return comment.likes;
  }
  return 0;
};
