import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import white_shrug from '../../assets/white_shrukg.png';
import CourseList from '../../components/CourseList';
import OnboardingModal from '../../components/OnboardingModal';
import SelectCourseFolderButton from '../../components/SelectCourseFolderButton';
import filterStorageKeys from '../../services/filterStorageKeys';
import { IState } from '../../store';
import { loadStoragedCourses } from '../../store/modules/catalog/actions';
import { ICourse } from '../../store/modules/catalog/types';
import {
  Container,
  EmptyListContainer,
  EmptyListLabel,
  LoadingLabel,
  Shrug,
  Title,
  Toolbar,
} from './styles';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

const HomePage: React.FC = () => {
  const courses = useSelector<IState, ICourse[]>(
    (state) => state.catalog.courses
  );

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  const handleStoragedCourses = useCallback(() => {
    const storagedKeys = Object.keys(localStorage);
    const formattedCourses: ICourse[] = filterStorageKeys(storagedKeys).map(
      (key) => {
        const course = localStorage.getItem(key) as string;
        return JSON.parse(course);
      }
    );

    const sortedFormattedCourses = formattedCourses.sort(
      (a, b) => b.lastAccessedDate - a.lastAccessedDate
    );

    dispatch(loadStoragedCourses(sortedFormattedCourses));
  }, [dispatch]);

  const checkOnboarding = () => {
    const hasOnboarding = localStorage.getItem('@HAS_ONBOARDING');
    if (!hasOnboarding) {
      setIsOnboardingActive(true);
    }
  };

  useEffect(() => {
    // localStorage.clear();
    try {
      checkOnboarding();
      handleStoragedCourses();
    } catch (err) {
      console.error(err);
    }
  }, [handleStoragedCourses]);

  if (isLoading) {
    return (
      <EmptyListContainer>
        <LoadingLabel>Loading...</LoadingLabel>
      </EmptyListContainer>
    );
  }

  return (
    <Container>
      <Toolbar>
        <Title>My courses</Title>
        <SelectCourseFolderButton setIsLoading={setIsLoading} />
      </Toolbar>
      {courses.length > 0 ? (
        <CourseList courses={courses} />
      ) : (
        <EmptyListContainer>
          <Shrug alt="thumbnail" src={white_shrug} />
          <EmptyListLabel>
            Looks like you haven't added any courses yet, press the green button
            to add the first one!
          </EmptyListLabel>
        </EmptyListContainer>
      )}

      <OnboardingModal
        setIsActive={setIsOnboardingActive}
        isActive={isOnboardingActive}
      />
    </Container>
  );
};

export default HomePage;
