import React from 'react';
import { Link } from 'react-router-dom';

const Hackthons = () => {
    return (
        <div className='relative z-0 bg-primary min-h-screen w-full'>
            <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center min-h-screen w-full'>
                <div className='max-w-7xl mx-auto px-6 py-20'>
                    {/* Back Button */}
                    <Link
                        to="/"
                        className='inline-flex items-center gap-2 text-white mb-8 hover:text-secondary transition-colors'
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Back to Portfolio
                    </Link>

                    {/* Header */}
                    <h1 className='text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] mb-4 w-full'>
                        Coming soon
                    </h1>

                </div>
            </div>
        </div>
    );
};

export default Hackthons;