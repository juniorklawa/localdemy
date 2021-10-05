import styled from 'styled-components';

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
