'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function VideoModal({ isOpen, setIsOpen, videoSrc, title }) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (isOpen && videoRef.current) {
      setLoading(true);
      setError(null);

      // Add event listeners for better video loading handling
      const handleCanPlay = () => {
        if (mounted) {
          setLoading(false);
          videoRef.current?.play().catch((err) => {
            console.error('AutoPlay failed:', err);
            setLoading(false);
          });
        }
      };

      const handleLoadedMetadata = () => {
        if (mounted) {
          console.log('Video metadata loaded:', videoSrc);
        }
      };

      const video = videoRef.current;
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.load();

      return () => {
        mounted = false;
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.pause();
        video.currentTime = 0;
      };
    }
  }, [isOpen, videoSrc]);

  const handleVideoError = (e) => {
    console.error('Video Error Details:', {
      src: videoSrc,
      error: e?.target?.error,
      networkState: videoRef.current?.networkState,
      readyState: videoRef.current?.readyState,
    });
    setError('Error loading video. Please try again.');
    setLoading(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
        aria-modal="true"
        role="dialog"
        aria-labelledby="video-modal-title"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl rounded-2xl bg-white p-6">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title
                  as="h3"
                  id="video-modal-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                  aria-label="Close video modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="relative pb-[56.25%] h-0">
                {error ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-red-600 text-center p-4">{error}</p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    controls
                    className="absolute top-0 left-0 w-full h-full rounded-lg bg-black"
                    onError={handleVideoError}
                    controlsList="nodownload"
                    preload="auto"
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {loading && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

