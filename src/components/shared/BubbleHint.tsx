import React, { useState, useRef, useEffect, useCallback, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

export type BubblePlacement = 'top' | 'bottom' | 'left' | 'right';

export interface BubbleHintProps {
  content: React.ReactNode;
  placement?: BubblePlacement;
  delay?: number;
  disabled?: boolean;
  offset?: number;
  className?: string;
  children: React.ReactElement;
}

interface PositionStyle {
  top: number;
  left: number;
  actualPlacement: BubblePlacement;
  arrowLeft?: number;
  arrowTop?: number;
}

export const BubbleHint: React.FC<BubbleHintProps> = ({
  content,
  placement = 'top',
  delay = 120,
  disabled = false,
  offset = 12, // 12px standoff clearance prevents large cursors from obscuring hint
  className = '',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<PositionStyle | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const touchDismissTimerRef = useRef<number | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;

    // Default estimate if not measured yet
    const tipWidth = tooltipEl ? tooltipEl.offsetWidth : 160;
    const tipHeight = tooltipEl ? tooltipEl.offsetHeight : 34;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const screenMargin = 12; // Min gap from viewport boundary

    let targetPlacement = placement;

    // Viewport Boundary Collision Detection & Automatic Flipping
    if (placement === 'top') {
      if (triggerRect.top - tipHeight - offset < screenMargin) {
        targetPlacement = 'bottom';
      }
    } else if (placement === 'bottom') {
      if (triggerRect.bottom + tipHeight + offset > viewportHeight - screenMargin) {
        targetPlacement = 'top';
      }
    } else if (placement === 'left') {
      if (triggerRect.left - tipWidth - offset < screenMargin) {
        targetPlacement = 'right';
      }
    } else if (placement === 'right') {
      if (triggerRect.right + tipWidth + offset > viewportWidth - screenMargin) {
        targetPlacement = 'left';
      }
    }

    let top = 0;
    let left = 0;
    let arrowLeft: number | undefined;
    let arrowTop: number | undefined;

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    if (targetPlacement === 'top' || targetPlacement === 'bottom') {
      // Calculate centered X
      left = triggerCenterX - tipWidth / 2;

      // Clamp horizontally inside viewport boundaries
      if (left < screenMargin) {
        left = screenMargin;
      } else if (left + tipWidth > viewportWidth - screenMargin) {
        left = viewportWidth - screenMargin - tipWidth;
      }

      // Calculate arrow position relative to tooltip box to point accurately at trigger
      arrowLeft = Math.max(12, Math.min(tipWidth - 12, triggerCenterX - left));

      if (targetPlacement === 'top') {
        top = triggerRect.top - tipHeight - offset;
      } else {
        top = triggerRect.bottom + offset;
      }
    } else {
      // Horizontal placement (left/right)
      top = triggerCenterY - tipHeight / 2;

      // Clamp vertically inside viewport
      if (top < screenMargin) {
        top = screenMargin;
      } else if (top + tipHeight > viewportHeight - screenMargin) {
        top = viewportHeight - screenMargin - tipHeight;
      }

      arrowTop = Math.max(8, Math.min(tipHeight - 8, triggerCenterY - top));

      if (targetPlacement === 'left') {
        left = triggerRect.left - tipWidth - offset;
      } else {
        left = triggerRect.right + offset;
      }
    }

    setPosition({
      top: Math.round(top),
      left: Math.round(left),
      actualPlacement: targetPlacement,
      arrowLeft,
      arrowTop,
    });
  }, [placement, offset]);

  const show = useCallback(() => {
    if (disabled || !content) return;
    if (timerRef.current !== null) clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  }, [disabled, content, delay, calculatePosition]);

  const hide = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (touchDismissTimerRef.current !== null) {
      clearTimeout(touchDismissTimerRef.current);
      touchDismissTimerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  // Handle Mobile / Touch interactions: tap to toggle, auto-dismiss
  const handleTouch = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !content) return;
      if (isVisible) {
        hide();
      } else {
        show();
        // Auto-dismiss on touch devices after 3 seconds
        touchDismissTimerRef.current = window.setTimeout(() => {
          hide();
        }, 3000);
      }
    },
    [disabled, content, isVisible, hide, show]
  );

  // Recalculate on scroll, window resize, or dynamic layout shift
  useEffect(() => {
    if (!isVisible) return;
    calculatePosition();

    const handleScroll = () => calculatePosition();
    const handleResize = () => calculatePosition();

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Handle outside click / touch to dismiss on mobile
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        hide();
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('touchstart', handleOutsideClick);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isVisible, calculatePosition, hide]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      if (touchDismissTimerRef.current !== null) clearTimeout(touchDismissTimerRef.current);
    };
  }, []);

  // Suppress native browser tooltips: strip native `title` prop on child
  const childProps = children.props as Record<string, any>;
  const accessibleLabel = childProps['aria-label'] || (typeof content === 'string' ? content : undefined);

  const enhancedChild = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && 'current' in childRef) {
        childRef.current = node;
      }
    },
    // Explicitly delete/suppress native title attribute to prevent ugly OS browser tooltips
    title: undefined,
    'aria-label': accessibleLabel,
    onMouseEnter: (e: React.MouseEvent) => {
      childProps.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      childProps.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      childProps.onFocus?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      childProps.onBlur?.(e);
      hide();
    },
    onTouchStart: (e: React.TouchEvent) => {
      childProps.onTouchStart?.(e);
      handleTouch(e);
    },
  });

  const portalElement = typeof document !== 'undefined' ? document.body : null;

  return (
    <>
      {enhancedChild}
      {portalElement &&
        createPortal(
          <AnimatePresence>
            {isVisible && position && (
              <motion.div
                ref={tooltipRef}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                  zIndex: 9999,
                }}
                className={`pointer-events-none select-none max-w-xs px-2.5 py-1.5 rounded-lg text-[11px] font-medium leading-normal tracking-tight shadow-xl backdrop-blur-md bg-neutral-900/95 dark:bg-neutral-800/95 text-neutral-100 dark:text-neutral-100 border border-neutral-700/70 dark:border-neutral-700/80 ${className}`}
              >
                {/* Micro theme accent indicator pill */}
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span>{content}</span>
                </div>

                {/* Direct Arrow Pointer positioned to anchor */}
                {position.arrowLeft !== undefined && (
                  <div
                    style={{ left: `${position.arrowLeft}px` }}
                    className={`absolute -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 dark:bg-neutral-800/95 border-neutral-700/70 dark:border-neutral-700/80 ${
                      position.actualPlacement === 'top'
                        ? 'bottom-[-4px] border-b border-r'
                        : 'top-[-4px] border-t border-l'
                    }`}
                  />
                )}

                {position.arrowTop !== undefined && (
                  <div
                    style={{ top: `${position.arrowTop}px` }}
                    className={`absolute -translate-y-1/2 w-2 h-2 rotate-45 bg-neutral-900/95 dark:bg-neutral-800/95 border-neutral-700/70 dark:border-neutral-700/80 ${
                      position.actualPlacement === 'left'
                        ? 'right-[-4px] border-t border-r'
                        : 'left-[-4px] border-b border-l'
                    }`}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          portalElement
        )}
    </>
  );
};
