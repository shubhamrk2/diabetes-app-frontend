'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from './VideoModal';

export default function VideoCard({ video, onClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleOpen = () => {
    if (onClick) {
      onClick(video);
    } else {
      setIsModalOpen(true);
    }
  };

  const showOverlay = isHovered || isFocused;

  return (
    <>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`Play video: ${video.title}`}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ outline: 'none' }}
      >
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail}
            alt={`Thumbnail for ${video.title}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <AnimatePresence>
            {showOverlay && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              >
                <PlayIcon className="w-16 h-16 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h3>
          <p className="text-gray-600">{video.description}</p>
        </div>
      </motion.div>

      {/* Fallback modal */}
      {!onClick && (
        <VideoModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          videoSrc={video.src}
          title={video.title}
        />
      )}
    </>
  );
}
