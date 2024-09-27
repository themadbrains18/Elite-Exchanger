const FooterSkeleton = () => {
    return (
        <div className="bg-gray-800 p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10">
                {/* Column skeletons */}
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-4">
                        <div className="h-6 bg-gray-700 rounded-md animate-pulse"></div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-700 rounded-md animate-pulse"></div>
                        ))}
                    </div>
                ))}

                {/* Payment method icons */}
                <div className="col-span-4 flex justify-start space-x-4 mt-8">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                    ))}
                </div>

                {/* Social media icons */}
                <div className="col-span-4 flex justify-center space-x-4 mt-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-6 w-6 bg-gray-700 rounded-full animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FooterSkeleton;
