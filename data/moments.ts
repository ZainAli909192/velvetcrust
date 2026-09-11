export type Moment = {
  id: string;
  label: string;
  title: string;
  description: string;
 
  image: string;
 
};

export const moments: Moment[] = [
  {
    id: "birthday",
    label: "Birthdays",
    title: "Make their day extra special.",
    description: "A cheesecake to celebrate the ones you love.",
    image: "/images/moments/birthday.png",
  },
  {
    id: "celebrations",
    label: "Celebrations",
    title: "Add sweetness to life’s big moments.",
    description:
      "Perfect cheesecakes for parties, achievements and special occasions.",
    image: "/images/moments/celebrations.png",
  },
  {
    id: "gifting",
    label: "Gifting",
    title: "A thoughtful treat for the ones you care about.",
    description:
      "Because the best gifts come from the heart and taste amazing.",
    image: "/images/moments/gifting.png",
  },
  {
    id: "just-because",
    label: "Just Because",
    title: "No reason needed for something sweet.",
    description:
      "Sometimes, the simplest moments deserve the sweetest treats.",
    image: "/images/moments/just-because.png",
  },
];