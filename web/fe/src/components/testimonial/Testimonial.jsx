import { motion } from 'framer-motion';

export default function Testimonial({ author, quote }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-indigo-950 rounded-2xl shadow-xl p-10 md:p-12"
        >
            <p className="text-xl md:text-2xl leading-relaxed text-yellow-800 mb-8">
                “{quote}”
            </p>

            <div>
                <p className="text-lg font-semibold text-gray-700">{author}</p>
            </div>
        </motion.div>
    );
}
