import React from 'react';
import idea from '../../assets/play.png';
import {
  Container,
  Icon,
  NiceButton,
  Step,
  StyledModal,
  Subtitle,
  Title,
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
        <Step>1. Click the "New" button.</Step>

        <Step>2. Select your course folder.</Step>

        <Step>
          3. If you want it to have a cover, you must pre-add the course cover
          image with the name "thumbnail" inside the course folder, or add a
          cover in the edit screen.
        </Step>

        <Step>4. Click in OK.</Step>

        <Step>5. Happy learning ;)</Step>

        <NiceButton onClick={handleOnButtonPress}>Nice!</NiceButton>
      </Container>
    </StyledModal>
  );
};

export default OnboardingModal;
