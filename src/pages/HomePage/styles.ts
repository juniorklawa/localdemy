import styled from 'styled-components';

export const Container = styled.div`
  flex-direction: column;
  background-color: #12181b;
  width: 80%;
  margin: auto;
`;

export const Title = styled.h1`
  color: #fff;
  font-family: OpenSans-ExtraBold;
  font-size: 42px;
`;

export const Toolbar = styled.div`
  padding: 8px;
  margin-top: 16px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
`;

export const CoursesContainer = styled.div`
  flex-direction: row;
  display: flex;
`;

export const AddCourseButton = styled.button`
  background-color: #00c853;
  width: 120px;
  color: #fff;
  border-radius: 50px;
  font-family: OpenSans-Bold;
  height: 40px;
  transition: background-color 200ms ease-in-out, transform 300ms ease-in-out;

  &:hover {
    -webkit-transform: translateY(-3px);
    transform: translateY(-3px);
    transition: background-color 200ms ease-in-out, transform 300ms ease-in-out;
  }
`;

export const CourseContainer = styled.button`
  width: 23%;
  box-sizing: border-box;
  background-color: #2a2e35;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: transform 300ms ease-in-out, border-color 300ms ease-in-out;
  border: 2px solid transparent;

  &:hover {
    -webkit-transform: translateY(-5px);
    transform: translateY(-5px);
    border-color: #00c853;
    transition: transform 300ms ease-in-out, border-color 300ms ease-in-out;
  }
`;

export const Thumbnail = styled.img`
  width: 90%;
  padding-top: 16px;
  align-self: center;
  object-fit: contain;
`;

export const InfoContainer = styled.div`
  padding: 16px;
  text-align: start;
  display: flex;
  flex-direction: column;
`;

export const EmptyListLabel = styled.p`
  align-self: center;
  font-family: OpenSans-Regular;
  color: #757575;
`;

export const LoadingLabel = styled.h1`
  align-self: center;
  font-family: OpenSans-Bold;
  color: #fff;
`;

export const EmptyListContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 30vh;
  margin-top: 180px;
`;

export const Shrug = styled.img`
  margin: auto;
  width: 50%;
  opacity: 0.2;
`;

export const CourseTitle = styled.p`
  font-family: 'OpenSans-Bold';
  text-align: start;
  color: #ffffff;
`;

export const ProgressLabel = styled.p`
  font-family: 'OpenSans-Regular';
  color: #fff;
  font-size: 13px;
`;
