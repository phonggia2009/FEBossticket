import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Thứ tự các route — dùng để xác định hướng trượt
const routeOrder: Record<string, number> = {
  '/login':    0,
  '/register': 1,
};

// Lưu route trước đó để so sánh hướng
let prevPathname = '';

const getDirection = (currentPath: string, previousPath: string): number => {
  const curr = routeOrder[currentPath] ?? 0;
  const prev = routeOrder[previousPath] ?? 0;
  return curr > prev ? 1 : -1; // 1 = trượt trái, -1 = trượt phải
};

interface Props {
  children: React.ReactNode;
}

const PageTransitionWrapper: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  const direction = getDirection(location.pathname, prevPathname);
  prevPathname = location.pathname;

  const variants = {
    initial: (dir: number) => ({
      x: dir * 80,        // Vào từ phải (dir=1) hoặc từ trái (dir=-1)
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir * -80,       // Ra về trái (dir=1) hoặc về phải (dir=-1)
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1], // ease-in-out cubic
        }}
        style={{ width: '100%', minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;