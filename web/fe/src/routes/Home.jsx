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
        <div className="mx-auto w-full max-w-6xl px-4 flex flex-col gap-6 md:flex-row md:items-start">
            <div className="w-full md:w-1/2">
                <ConsultationForm />
            </div>

            <div className="w-full md:w-1/2">
                <SubjectList subjects={subjects} />
            </div>
        </div>
    );
};

export default Home;
