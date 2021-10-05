import styled from 'styled-components';

interface VideoButtonSpeedProps {
  isSelected: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0px;
  flex: 1;
  height: 100vh;
  padding: 0px;
  overflow: hidden;
`;

export const NavigationContainer = styled.div`
  flex-direction: row;
  display: flex;
  margin-left: 8px;
`;

export const CourseInfoContainer = styled.div`
  margin-top: 4px;
  margin-left: 16px;
`;

export const TotalClasses = styled.p`
  font-family: OpenSans-Regular;
  color: #bdbdbd;
  margin-top: 8px;
  font-size: 12px;
`;

export const CourseDuration = styled.p`
  font-family: OpenSans-Regular;
  color: #bdbdbd;
  margin-top: 2px;
  font-size: 12px;
`;

export const AboutThisCourseLabel = styled.h4`
  font-family: OpenSans-Bold;
  color: #bdbdbd;
`;

export const FinishAndGoToNextButton = styled.button`
  color: #fff;
  background-color: #00c853;
  border-radius: 10px;
  margin-top: 8px;
  margin-right: 16px;
  padding-right: 16px;
  padding-left: 16px;
  height: 50px;
  font-family: OpenSans-SemiBold;
`;

export const VideoWrapper = styled.div`
  min-height: 820px;
`;

export const SpeedControlContainer = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

export const ContentToolBar = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const VideoButtonSpeed = styled.button<VideoButtonSpeedProps>`
  color: ${({ isSelected }) => (isSelected ? '#fff' : '#888B8D')};
  background-color: ${({ isSelected }) => (isSelected ? '#00c853' : '#292F31')};
  width: 80px;
  height: 20px;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  border-radius: 6px;
  font-size: 14px;
  font-family: OpenSans-SemiBold;
`;

export const VideoContainer = styled.div`
  width: 100%;
`;

export const LessonTitle = styled.h2`
  color: #fff;
  font-family: OpenSans-Bold;
  margin-top: 8px;
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
