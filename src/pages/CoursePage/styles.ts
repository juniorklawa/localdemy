import styled from 'styled-components';
import ReactModal from 'react-modal';

interface ClassProps {
  isSelected: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0px;
  flex: 1;
  height: 100vh;
  padding: 0px;
  /* height: 100%; */
  overflow: hidden;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #263238;
  align-items: center;
  padding: 16px;
  justify-content: space-between;
`;

export const ClassContainerButton = styled.button<ClassProps>`
  max-height: 70px;
  padding: 16px;
  background-color: ${({ isSelected }) => (isSelected ? '#454E55' : '#2A2E35')};
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
`;

export const NavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 8px;
`;

export const OptionButton = styled.button`
  font-family: OpenSans-Regular;
  color: #fff;
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const ClassesContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #212121;
  width: 100%;
  height: 90vh;
  align-items: center;
  overflow: auto;
`;

export const VideoContainer = styled.div`
  width: 100%;
`;

export const LessonTitle = styled.h2`
  color: #fff;
  font-family: OpenSans-Bold;
  margin-top: 16px;
  margin-left: 16px;
`;

export const BottomTab = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  width: 100%;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

export const OptionButtonLabel = styled.p`
  margin-right: 8px;
`;

export const CourseTitle = styled.h3`
  color: #fff;
  font-family: OpenSans-ExtraBold;
  margin-left: 8px;
`;

export const GoBackButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;

  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const StyledModal = styled(ReactModal)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const ModalContainer = styled.div`
  background-color: '#fff';
  max-width: 700px;
  display: flex;
  padding: 3em 2em;
`;
