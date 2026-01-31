import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { slideIn } from "../utils/motion";
import { styles } from "../utils/styles";
import { sectionWrapper } from "../HOC/section-wrapper";
import { CarCanvas } from "./canvas/Car";
const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const handleChange = (e) => {
      const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
     e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Afnan Kazi",
          from_email: form.email,
          to_email: "afnanarifkazi2@gmail.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex flex-col-reverse gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="bg-black-100 p-8 felx-[0.75] rounded-2xl"
      >
        <p className={`${styles.sectionSubText}`}>Get In Touch </p>
        <h3 className={`${styles.sectionHeadText}`}>Contact. </h3>

        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="mt-8 flex flex-col gap-8"
        >
          <label className="flex flex-col ">
            <span className="text-white mb-4 font-medium">Your Name</span>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={form.name}
              placeholder="What's your name?"
              className="bg-tertiary px-4 py-6 text-white placeholder:text-secondary font-medium rounded-lg outline-none border-none"
            />
          </label>

           <label className="flex flex-col ">
            <span className="text-white mb-4 font-medium">Your Email</span>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={form.email}
              placeholder="What's your email?"
              className="bg-tertiary px-4 py-6 text-white placeholder:text-secondary font-medium rounded-lg outline-none border-none"
            />
          </label>

           <label className="flex flex-col ">
            <span className="text-white mb-4 font-medium">Your Message</span>
            <textarea
              rows={7}
              name="message"
              id="message"
              onChange={handleChange}
              value={form.message}
              placeholder="What do you want to say?"
              className="bg-tertiary px-4 py-6 text-white placeholder:text-secondary font-medium rounded-lg outline-none border-none"
            />
          </label>

          <button className="bg-tertiary w-fit py-4 px-4" >
            {loading ? "Sending...." : "send"}
          </button>

        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:h-auto xl:flex-1 md:h-[500px] h-[350px] "
      >
        <CarCanvas/>
      </motion.div>


    </div>
  );
};
const ContactWrapper = sectionWrapper(Contact, "contact");

export default ContactWrapper;
