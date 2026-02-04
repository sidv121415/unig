import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import { BsSearch } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

// 🔹 Chakra UI imports
import {
    Box,
    HStack,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    useColorModeValue,
    Icon,
    Collapse,
    Flex,
    Text,
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spacer
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
// import logo from "../assets/nnn_logo.png"

import { sampleItems, CardNavItem } from './navData';
import './CardNav.css';

/* Menu Toggle Components */
const Path = (props: any) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="currentColor"
        strokeLinecap="round"
        {...props}
    />
);

const MenuToggle = ({ toggle, isOpen }: { toggle: () => void, isOpen: boolean }) => {
    const color = useColorModeValue("black", "white");
    return (
        <Box onClick={toggle} cursor="pointer" ml={2} color={color}>
            <svg width="23" height="23" viewBox="0 0 23 23">
                <Path
                    variants={{
                        closed: { d: "M 2 2.5 L 20 2.5" },
                        open: { d: "M 3 16.5 L 17 2.5" }
                    }}
                    animate={isOpen ? "open" : "closed"}
                />
                <Path
                    d="M 2 9.423 L 20 9.423"
                    variants={{
                        closed: { opacity: 1 },
                        open: { opacity: 0 }
                    }}
                    transition={{ duration: 0.1 }}
                    animate={isOpen ? "open" : "closed"}
                />
                <Path
                    variants={{
                        closed: { d: "M 2 16.346 L 20 16.346" },
                        open: { d: "M 3 2.5 L 17 16.346" }
                    }}
                    animate={isOpen ? "open" : "closed"}
                />
            </svg>
        </Box>
    );
};

export interface CardNavProps {
    logo: string;
    logoAlt?: string;
    items: CardNavItem[];
    className?: string;
    ease?: string;
    baseColor?: string;
    menuColor?: string;         // not used now but kept for compatibility
    buttonBgColor?: string;     // not used now
    buttonTextColor?: string;   // not used now
    forceCompact?: boolean;
    onSearch?: (query: string) => void;
    onFilterSelect?: (type: string, value: string | number) => void;
    onLogoClick?: () => void;
}

const CardNav: React.FC<CardNavProps> = ({
    logo,
    logoAlt = 'Logo',
    items,
    className = '',
    ease = 'power3.out',
    baseColor = '#fff',
    forceCompact = false,
    onSearch,
    onFilterSelect,
    onLogoClick
}) => {
    const navRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    // Compute whether to show compact mode (either user typing OR forced by parent)
    const isSearchActive = isSearchFocused || forceCompact;

    // optional: simple card fade-up animation
    React.useLayoutEffect(() => {
        if (!cardsRef.current.length) return;
        gsap.fromTo(
            cardsRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease }
        );
    }, [items, ease]);

    const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
        if (el) cardsRef.current[i] = el;
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        // when user leaves the input, go back to normal nav if empty? 
        // For now just toggle focus state
        setIsSearchFocused(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(searchValue);
            // Optionally blur input
            (e.target as HTMLInputElement).blur();
        }
    };

    const handleClearSearch = () => {
        setSearchValue("");
        if (onSearch) onSearch("");
        // Also ensure focus remains if desired, or blur
        // inputRef.current?.focus(); 
    };

    const handleLogoClick = () => {
        setSearchValue("");
        if (onSearch) onSearch("");
        if (onLogoClick) onLogoClick();
    };

    return (
        <div className={`card-nav-container ${className}`}>
            <Box
                ref={navRef}
                className="card-nav"
                bg={baseColor}
                // 🔹 animation for nav shape when searching
                borderRadius={isSearchActive ? '30px' : 'xl'}
                w={isSearchActive ? { base: '95%', md: '500px' } : { base: '95%', md: '850px' }}
                transition="all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)"
                backdropFilter="blur(12px)"
                border="1px solid"
                borderColor={useColorModeValue('gray.100', 'whiteAlpha.200')}
                px={4}
                py={2}
            >
                {/* 🔹 Top bar replaced with your Flex + DarkSwitch */}
                <Flex align="center" padding={2} justifyContent="space-between">
                    <AnimatePresence>
                        {!isSearchActive && (
                            <motion.div
                                initial={{ width: 'auto', opacity: 1, marginRight: '1rem' }}
                                exit={{ width: 0, opacity: 0, marginRight: 0 }}
                                animate={{ width: 'auto', opacity: 1, marginRight: '1rem' }}
                                transition={{ duration: 0.3 }}
                                style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}
                            >
                                <MenuToggle toggle={() => setIsMenuOpen(!isMenuOpen)} isOpen={isMenuOpen} />
                                <Box w={5} />
                                <Text
                                    fontSize="3xl"
                                    fontWeight="900"
                                    fontStyle="italic"
                                    bgGradient="linear(to-r, white, gray.500)"
                                    bgClip="text"
                                    cursor="pointer"
                                    fontFamily="sans-serif"
                                    onClick={handleLogoClick}
                                >
                                    uniG
                                </Text>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <InputGroup
                        width={isSearchActive ? '100%' : { base: '40%', md: '300px' }}
                        transition="all 0.3s ease"
                    >
                        {/* 🔹 Move icon based on search state */}
                        {isSearchActive ? (
                            searchValue ? (
                                <InputRightElement cursor="pointer" onClick={handleClearSearch}>
                                    <Icon as={MdClose} color="gray.500" />
                                </InputRightElement>
                            ) : (
                                <InputRightElement pointerEvents="none" children={<Icon as={BsSearch} color="gray.500" />} />
                            )
                        ) : (
                            <InputLeftElement pointerEvents="none" children={<Icon as={BsSearch} color="gray.500" />} />
                        )}

                        <Input
                            variant="filled"
                            placeholder="Search Games"
                            borderRadius={isSearchActive ? 24 : 20}
                            focusBorderColor="green.500"
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </InputGroup>

                    {/* Auth Button */}
                    <Box ml={4}>
                        {isAuthenticated ? (
                            <Menu>
                                <MenuButton>
                                    <Avatar size="sm" name={user?.username} bg="purple.500" />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={logout}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <Button
                                size="sm"
                                colorScheme="purple"
                                borderRadius="full"
                                onClick={() => setIsLoginModalOpen(true)}
                                display={isSearchActive ? "none" : "block"} // Hide on search focus to save space? Or keep it?
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Flex>

                <LoginModal isOpen={isLoginModalOpen ? 1 : 0} onClose={() => setIsLoginModalOpen(false)} />

                <Collapse in={isMenuOpen} animateOpacity>
                    <div className="card-nav-content">
                        {(items || []).slice(0, 3).map((item, idx) => (
                            <div
                                key={`${item.label}-${idx}`}
                                className="nav-card"
                                ref={setCardRef(idx)}
                                style={{ backgroundColor: item.bgColor, color: item.textColor }}
                            >
                                <div className="nav-card-label">{item.label}</div>
                                <div className="nav-card-links">
                                    {item.links?.map((lnk, i) => (
                                        <a
                                            key={`${lnk.label}-${i}`}
                                            className="nav-card-link"
                                            href={lnk.href}
                                            aria-label={lnk.ariaLabel}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (onFilterSelect && lnk.type && lnk.value) {
                                                    onFilterSelect(lnk.type, lnk.value);
                                                    setIsMenuOpen(false);
                                                }
                                            }}
                                        >
                                            <Icon
                                                as={lnk.icon || GoArrowUpRight}
                                                className="nav-card-link-icon"
                                                aria-hidden="true"
                                            />
                                            {lnk.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Collapse>
            </Box>
        </div >
    );
};

const NavBarComp = ({ forceCompact, onSearch, onFilterSelect, onLogoClick }: { forceCompact?: boolean, onSearch?: (q: string) => void, onFilterSelect?: (type: string, value: string | number) => void, onLogoClick?: () => void }) => {
    const bg = useColorModeValue('white', 'rgba(0, 0, 0, 0.8)');
    return <CardNav logo="" items={sampleItems} baseColor={bg} forceCompact={forceCompact} onSearch={onSearch} onFilterSelect={onFilterSelect} onLogoClick={onLogoClick} />;
}

export default NavBarComp;
