import React from "react";

function Footer() {
  return (
    <>
      <footer className="bg-gray-950 shadow-sm dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-base text-white sm:text-center dark:text-gray-400">
            © 2025{" "}
            NDC Admin Team
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
