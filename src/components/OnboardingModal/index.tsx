import React from 'react';
import idea from '../../assets/play.png';
import {
  Container,
  Icon,
  NiceButton,
  StyledModal,
  Subtitle,
  Title,
  TotalLessons,
} from './styles';

interface OnboardingModalProps {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isActive,
  setIsActive,
}) => {
  const handleOnButtonPress = () => {
    localStorage.setItem('@HAS_ONBOARDING', JSON.stringify(true));
    setIsActive(false);
  };

  return (
    <StyledModal
      isOpen={isActive}
      ariaHideApp={false}
      onRequestClose={() => setIsActive(false)}
      contentLabel="modal"
    >
      <Container>
        <Icon src={idea} />
        <Title>First time, right?</Title>
        <Subtitle>To add a new course</Subtitle>
        <TotalLessons>1. Click the "New" button.</TotalLessons>

        <TotalLessons>2. Select your course folder.</TotalLessons>

        <TotalLessons>
          3. If you want it to have a cover, you must pre-add the course cover
          image with the name "thumbnail" inside the course folder, or add a
          cover in the edit screen).
        </TotalLessons>

        <TotalLessons>4. Click in OK.</TotalLessons>

        <TotalLessons>5. Happy learning ;)</TotalLessons>

        <NiceButton onClick={handleOnButtonPress}>Ok!</NiceButton>
      </Container>
    </StyledModal>
  );
};

export default OnboardingModal;
