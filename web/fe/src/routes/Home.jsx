import ConsultationForm from '~/components/consultation-form/ConsultationForm';
import SubjectList from '~/components/subject-list/SubjectList';

const Home = (props) => {
    const subjects = [
        'Single-variable Calculus',
        'Multivariable Calculus',
        'Linear Algebra',
        'Statistics',
        'Cloud Infrastructure',
        'Software Engineering',
    ];
    return (
        <div className="mx-auto w-[80%] flex flex-row">
            <ConsultationForm />
            <SubjectList subjects={subjects} />
        </div>
    );
};

export default Home;
