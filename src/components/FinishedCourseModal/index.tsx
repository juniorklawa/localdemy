import React from 'react';
import confetti from '../../assets/confetti.png';
import { ICourse } from '../../store/modules/catalog/types';
import sumDuration from '../../utils/sumDuration';
import {
  Container,
  Description,
  Icon,
  NiceButton,
  StyledModal,
  Title,
  TotalLessons,
} from './styles';

interface FinishedCourseModalProps {
  isFinishedModalActive: boolean;
  setIsFinishedModalActive: (isActive: boolean) => void;
  currentCourse: ICourse;
}

const FinishedCourseModal: React.FC<FinishedCourseModalProps> = ({
  isFinishedModalActive,
  setIsFinishedModalActive,
  currentCourse,
}) => {
  return (
    <StyledModal
      isOpen={isFinishedModalActive}
      ariaHideApp={false}
      onRequestClose={() => setIsFinishedModalActive(false)}
      contentLabel="modal"
    >
      <Container>
        <Icon src={confetti} />
        <Title>Congratulations!</Title>
        <Description>
          You have just finished the course: {currentCourse.courseTitle}
        </Description>
        <TotalLessons>
          {`with ${currentCourse.modules.reduce((acc, item) => {
            return acc + item.lessons.length;
          }, 0)} lessons in total of ${sumDuration(currentCourse)} `}
        </TotalLessons>

        <NiceButton
          onClick={() => {
            setIsFinishedModalActive(false);
          }}
        >
          Nice!
        </NiceButton>
      </Container>
    </StyledModal>
  );
};

export default FinishedCourseModal;
