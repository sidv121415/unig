import { useEffect, useRef, FC, ReactNode } from 'react';
import { gsap } from 'gsap';
import './GridMotion.css';

interface GridMotionProps {
    items?: (string | ReactNode)[];   // optional, fallback
    imageUrls?: string[];             // NEW: images from API
    gradientColor?: string;
}

const GridMotion: FC<GridMotionProps> = ({
    items = [],
    imageUrls,
    gradientColor = 'black',
}) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const mouseXRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);

    const ROWS = 4;
    const COLS = 12; // Increased to show more images across the wider width
    const totalCells = ROWS * COLS;

    // --- decide what to render in the cells ---
    // If imageUrls are provided (from API), we use them and ignore items.
    // We only need 5–6 images; we'll loop over them.
    const effectiveImages = (imageUrls && imageUrls.length > 0)
        ? imageUrls
        : []; // if no images yet, we'll fall back to "items" below

    const defaultItems = Array.from(
        { length: totalCells },
        (_, index) => `Item ${index + 1}`
    );

    // If we have imageUrls, create a grid that uses them;
    // otherwise, use the old `items` / default text.
    const combinedItems: (string | ReactNode)[] = (() => {
        if (effectiveImages.length > 0) {
            const imgs = effectiveImages;
            const imgCount = imgs.length;

            // We only care that each row has the same sequence:
            // Row0: img0, img1, img2, ...
            // Row1: reversed: ..., img2, img1, img0
            // Row2: again normal, etc.
            const cells: string[] = [];

            for (let row = 0; row < ROWS; row++) {
                const isNormal = row % 2 === 0; // even rows normal, odd reversed
                for (let col = 0; col < COLS; col++) {
                    const baseIndex = col % imgCount; // repeat images if < COLS
                    const imgIndex = isNormal
                        ? baseIndex
                        : imgCount - 1 - baseIndex; // reverse order
                    cells.push(imgs[imgIndex]);
                }
            }

            return cells;
        }

        // fallback: original logic with text / JSX items
        const srcItems =
            items.length > 0
                ? items.slice(0, totalCells)
                : defaultItems;

        if (srcItems.length < totalCells) {
            // pad if fewer
            const padded = [...srcItems];
            while (padded.length < totalCells) {
                padded.push(`Item ${padded.length + 1}`);
            }
            return padded;
        }

        return srcItems;
    })();

    // --- motion logic ---
    useEffect(() => {
        gsap.ticker.lagSmoothing(0);

        const handleMouseMove = (e: MouseEvent): void => {
            mouseXRef.current = e.clientX;
        };

        const updateMotion = (): void => {
            // Mouse parallax parameters
            const maxMoveAmount = 300;
            const baseDuration = 0.8;
            const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

            // Scroll parameter: adjust this multiplier to control how much it scrolls
            // "scroll more" -> higher multiplier
            const scrollVelocityFactor = 0.8;

            const currentScrollY = window.scrollY;

            rowRefs.current.forEach((row, index) => {
                if (row) {
                    const direction = index % 2 === 0 ? 1 : -1;

                    // Mouse contribution
                    const mouseAction = ((mouseXRef.current / window.innerWidth) * maxMoveAmount -
                        maxMoveAmount / 2);

                    // Scroll contribution
                    const scrollAction = (currentScrollY * scrollVelocityFactor);

                    // Combine them
                    const totalMove = (mouseAction + scrollAction) * direction;

                    gsap.to(row, {
                        x: totalMove,
                        duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
                        ease: 'power3.out',
                        overwrite: 'auto',
                    });
                }
            });
        };

        const removeAnimationLoop = gsap.ticker.add(updateMotion);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            removeAnimationLoop();
        };
    }, []);

    return (
        <div className="noscroll loading" ref={gridRef}>
            <section
                className="intro"
                style={{
                    background: `radial-gradient(circle, ${gradientColor} 0%, #000 100%)`,
                }}
            >
                <div className="gridMotion-container">
                    {Array.from({ length: ROWS }, (_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="row"
                            ref={(el) => {
                                rowRefs.current[rowIndex] = el;
                            }}
                        >
                            {Array.from({ length: COLS }, (_, itemIndex) => {
                                const globalIndex = rowIndex * COLS + itemIndex;
                                const content = combinedItems[globalIndex];

                                return (
                                    <div key={itemIndex} className="row__item">
                                        <div className="row__item-inner">
                                            {typeof content === 'string' && content.startsWith('http') ? (
                                                <div
                                                    className="row__item-img"
                                                    style={{
                                                        backgroundImage: `url(${content})`,
                                                    }}
                                                ></div>
                                            ) : (
                                                <div className="row__item-content">{content}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="fullview"></div>
            </section>
        </div>
    );
};

export default GridMotion;
