import { motion } from "framer-motion";


const variants = {
  left: {
    hidden: { opacity: 0, x: -40, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 40, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  },
  top: {
    hidden: { opacity: 0, x: 0, y: -20 },
    enter: { opacity: 1, x: 0, y: 10 },
    exit: { opacity: 0, x: 0, y: 0 },
  }
}


const ChartAnimation = ({ children, position}) => (
  <motion.div
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={variants[position]}
    transition={{ duration: 0.5, type: "easeInOut" }}
    style={{ position: "relative" }}

  >
    {children}
  </motion.div>
)


export default ChartAnimation;
