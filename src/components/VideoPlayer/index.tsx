import React from 'react';
import { ICourse } from '../../store/modules/catalog/types';

interface VideoPlayerProps {
  videoRef: React.MutableRefObject<HTMLVideoElement>;
  playbackRate: number;
  autoPlayEnabled: boolean;
  currentCourse: ICourse;
  currentModuleIndex: number;
  currentIndex: number;
  onEnded: () => void;
  saveLastPosition: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  saveVolume: (currentVolume: number) => void;
  volume: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  autoPlayEnabled,
  playbackRate,
  videoRef,
  currentCourse,
  currentModuleIndex,
  currentIndex,
  saveLastPosition,
  saveVolume,
  volume,
  onEnded,
}) => {
  const getLessonSource = () => {
    return `${
      currentCourse.modules[currentModuleIndex].lessons[currentIndex].path
    }#t=${
      currentCourse.modules[currentModuleIndex].lessons[currentIndex]
        .lastPosition || 0
    }`;
  };

  const handleOnLoadedData = () => {
    videoRef.current.playbackRate = playbackRate;
    videoRef.current.volume = volume;
  };

  return (
    <video
      ref={videoRef}
      onLoadedData={handleOnLoadedData}
      onVolumeChange={() => {
        saveVolume(videoRef.current.volume);
      }}
      autoPlay={autoPlayEnabled}
      key={currentCourse.modules[currentModuleIndex].lessons[currentIndex].path}
      width="100%"
      onPause={(e) => saveLastPosition(e)}
      onEnded={async () => {
        onEnded();
      }}
      controls
    >
      <source src={getLessonSource()} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;
