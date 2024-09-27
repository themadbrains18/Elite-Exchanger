// components/NavbarSkeleton.js
const NavbarSkeleton = () => {
    return (
      <div className="flex justify-between items-center px-5 py-3 bg-gray-200 animate-pulse">
        <div className="h-6 bg-gray-300 rounded-md w-24"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-300 rounded-md w-20"></div>
          <div className="h-4 bg-gray-300 rounded-md w-20"></div>
          <div className="h-4 bg-gray-300 rounded-md w-20"></div>
          <div className="h-4 bg-gray-300 rounded-md w-20"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-300 rounded-md w-20"></div>
          <div className="h-8 bg-gray-300 rounded-md w-20"></div>
        </div>
      </div>
    );
  };
  
  export default NavbarSkeleton;
  