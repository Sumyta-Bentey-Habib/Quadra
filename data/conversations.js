export const dummyConversations = [
  {
    id: 1,
    user: "Alice",
    avatar: "https://i.pravatar.cc/40?img=1",
    lastMessage: "See you tomorrow!",
    timestamp: "2h",
  },
  {
    id: 2,
    user: "Bob",
    avatar: "https://i.pravatar.cc/40?img=2",
    lastMessage: "Let's finish that project 🚀",
    timestamp: "5h",
  },
  {
    id: 3,
    user: "Charlie",
    avatar: "https://i.pravatar.cc/40?img=3",
    lastMessage: "Thanks for the help!",
    timestamp: "1d",
  },
];

export const dummyMessages = {
  1: [
    { id: 1, sender: "me", text: "Hey Alice 👋", time: "10:00 AM" },
    { id: 2, sender: "Alice", text: "Hi! How are you?", time: "10:02 AM" },
  ],
  2: [
    { id: 1, sender: "me", text: "Did you check the repo?", time: "9:00 PM" },
    { id: 2, sender: "Bob", text: "Yes! Looks good.", time: "9:05 PM" },
  ],
  3: [
    { id: 1, sender: "Charlie", text: "Thanks a lot!", time: "Yesterday" },
    { id: 2, sender: "me", text: "Anytime!", time: "Yesterday" },
  ],
};
