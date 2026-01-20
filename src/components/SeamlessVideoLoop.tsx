import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SeamlessVideoLoopProps {
    src: string;
    className?: string;
    overlayClassName?: string;
}

const SeamlessVideoLoop = ({ src, className, overlayClassName }: SeamlessVideoLoopProps) => {
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);
    const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
    const [isReady, setIsReady] = useState(false);

    // Продолжительность кроссфейда в секундах
    const CROSSFADE_DURATION = 1;

    const handleTimeUpdate = (videoIndex: 1 | 2) => {
        const currentRef = videoIndex === 1 ? videoRef1.current : videoRef2.current;

        if (currentRef) {
            const remainingTime = currentRef.duration - currentRef.currentTime;

            // Если осталось времени меньше чем длительность перехода, запускаем второе видео
            if (remainingTime <= CROSSFADE_DURATION && activeVideo === videoIndex) {
                const nextVideo = videoIndex === 1 ? 2 : 1;
                const nextRef = videoIndex === 1 ? videoRef2.current : videoRef1.current;

                if (nextRef) {
                    nextRef.currentTime = 0;
                    nextRef.play().then(() => {
                        setActiveVideo(nextVideo);
                    }).catch(console.error);
                }
            }
        }
    };

    useEffect(() => {
        // Инициализация
        if (videoRef1.current) {
            videoRef1.current.play().then(() => setIsReady(true));
        }
    }, []);

    return (
        <div className={`relative overflow-hidden w-full h-full bg-black ${className}`}>

            {/* Video 1 */}
            <motion.video
                ref={videoRef1}
                src={src}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 1 }}
                animate={{ opacity: activeVideo === 1 ? 1 : 0 }}
                transition={{ duration: CROSSFADE_DURATION, ease: "linear" }}
                muted
                playsInline
                preload="auto"
                onTimeUpdate={() => handleTimeUpdate(1)}
            />

            {/* Video 2 */}
            <motion.video
                ref={videoRef2}
                src={src}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeVideo === 2 ? 1 : 0 }}
                transition={{ duration: CROSSFADE_DURATION, ease: "linear" }}
                muted
                playsInline
                preload="auto"
                onTimeUpdate={() => handleTimeUpdate(2)}
            />

            {/* Overlay */}
            {overlayClassName && <div className={overlayClassName} />}
        </div>
    );
};

export default SeamlessVideoLoop;
