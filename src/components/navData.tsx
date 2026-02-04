import { IconType } from 'react-icons';
import { FaGamepad, FaHeart, FaDragon, FaDungeon } from 'react-icons/fa';
import { GiPistolGun } from 'react-icons/gi';

export type CardNavLink = {
    label: string;
    href: string;
    ariaLabel: string;
    type?: 'platform' | 'genre' | 'search' | 'library';
    value?: string | number;
    icon?: IconType;
};

export type CardNavItem = {
    label: string;
    bgColor: string;
    textColor: string;
    links: CardNavLink[];
};

export const sampleItems: CardNavItem[] = [
    {
        label: "Library",
        bgColor: "#E9D8FD",
        textColor: "#44337A",
        links: [
            { label: "My Games", href: "#", ariaLabel: "My Games", type: 'library', value: 'my-games', icon: FaGamepad },
            { label: "Wishlist", href: "#", ariaLabel: "Wishlist", type: 'library', value: 'wishlist', icon: FaHeart },
        ]
    },
    {
        label: "Genres",
        bgColor: "#C6F6D5",
        textColor: "#22543D",
        links: [
            { label: "Action", href: "#", ariaLabel: "Action", type: 'genre', value: 'Action', icon: GiPistolGun },
            { label: "RPG", href: "#", ariaLabel: "RPG", type: 'genre', value: 'RPG', icon: FaDragon },
            { label: "Adventure", href: "#", ariaLabel: "Adventure", type: 'genre', value: 'Adventure', icon: FaDungeon },
        ]
    },
    {
        label: "Top Games",
        bgColor: "#FEEBC8",
        textColor: "#7B341E",
        links: [
            { label: "GTA V", href: "#", ariaLabel: "GTA V", type: 'search', value: 'Grand Theft Auto V' },
            { label: "Cyberpunk", href: "#", ariaLabel: "Cyberpunk", type: 'search', value: 'Cyberpunk 2077' },
            { label: "Elden Ring", href: "#", ariaLabel: "Elden Ring", type: 'search', value: 'Elden Ring' },
        ]
    }
];
