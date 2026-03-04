import Testimonial from '~/components/testimonial/Testimonial';

const Testimonials = (props) => {
    const testimonials = [
        { author: 'Dolphin Lord', quote: 'Taught me some cool shit.' },
        { author: 'Mr Bangs', quote: 'Kindness matters, bruv.' },
    ];
    return (
        <div className="min-h-screen flex justify-center px-4 py-24">
            <div className="w-full max-w-4xl flex flex-col space-y-16">
                {testimonials.map((testimonial, n) => (
                    <Testimonial
                        author={testimonial.author}
                        quote={testimonial.quote}
                    />
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
