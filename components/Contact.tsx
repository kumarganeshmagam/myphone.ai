import React from 'react';

const SocialLink: React.FC<{ href: string; title: string; children: React.ReactNode }> = ({ href, title, children }) => (
    <a href={href} title={title} className="w-12 h-12 bg-brand-primary-dark rounded-full flex items-center justify-center text-white text-xl no-underline transition-transform duration-300 hover:scale-125">
      {children}
    </a>
);

const Contact: React.FC = () => {
  return (
    <section className="bg-brand-background py-20 px-8">
      <h2 className="text-center text-3xl font-display font-normal tracking-[0.3em] mb-12 text-brand-text italic">Contact Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
        <div>
          <h3 className="text-2xl mb-4 text-brand-primary font-display font-normal">Phone</h3>
          <p className="text-lg font-body font-normal text-brand-text">(123) 456-7890</p>
        </div>
        <div>
          <h3 className="text-2xl mb-4 text-brand-primary font-display font-normal">Email</h3>
          <p className="text-lg font-body font-normal text-brand-text">hello@reallygreatsite.com</p>
        </div>
        <div>
          <h3 className="text-2xl mb-4 text-brand-primary font-display font-normal">Address</h3>
          <p className="text-lg font-body font-normal text-brand-text">123 Anywhere St., Any City</p>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-12">
        <SocialLink href="#" title="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>
        </SocialLink>
        <SocialLink href="#" title="Twitter">
            {/* Fix: Removed invalid 'view' property from SVG element which was causing a type error. */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.177-1.341.243-2.043.189 1.4 1.882 3.644 2.894 5.941 2.502-1.954 1.524-4.413 2.266-7.094 1.967.659 3.518 3.255 5.541 6.264 5.274 6.784-1.047 10.51-6.173 9.77-11.83c.717-.516 1.335-1.173 1.824-1.89z"/></svg>
        </SocialLink>
        <SocialLink href="#" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.359-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.359-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
        </SocialLink>
      </div>
    </section>
  );
};

export default Contact;
