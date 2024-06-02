import { motion } from "framer-motion";

export default function Animated(props: any) {
  return (
    <motion.div
      className=""
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {props.children}
    </motion.div>
  );
}
