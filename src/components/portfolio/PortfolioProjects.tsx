import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import type { ProjectItem } from '../../data/portfolioData';
import { ArrowUpRightIcon, GithubIcon, ExternalLinkIcon, XIcon } from '../Icons';

const PortfolioProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="relative py-24 px-6 md:px-12 lg:px-16 bg-[#07080c] text-white overflow-hidden border-t border-white/10">
      {/* Background Orbs */}
      <div className="glow-orb-blue top-1/4 -left-20 opacity-30 pointer-events-none"></div>
      <div className="glow-orb-amber bottom-10 right-0 opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-3xl sm:text-4xl font-bold text-blue-500/40">04</span>
            <div className="flex flex-col">
              <span className="text-xs font-mono tracking-[0.25em] text-blue-400 uppercase font-semibold">
                MY PROJECTS
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white mt-1">
                Featured <span className="text-blue-400">Projects</span>
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-xs">
            Hand-picked engineering projects built with clean code and modern design principles.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {portfolioData.projects.map((project: ProjectItem, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-2xl"
            >
              {/* Top Image Preview Card */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-900 border-b border-white/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-transparent opacity-80"></div>

                {/* Category Pill Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-medium text-blue-400">
                  {project.category}
                </div>
              </div>

              {/* Card Body Info */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Pills & Actions */}
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-mono text-zinc-400">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center gap-1.5"
                    >
                      View Details
                      <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Detail View */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0d0e15] border border-white/20 p-6 sm:p-8 text-white shadow-2xl portfolio-container"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 border border-white/15 text-zinc-400 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mb-6 bg-zinc-900">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Title & Category */}
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
                {selectedProject.category} // {selectedProject.role}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display mt-1">
                {selectedProject.title}
              </h3>

              {/* Long Description */}
              <p className="text-sm sm:text-base text-zinc-300 font-light mt-4 leading-relaxed">
                {selectedProject.longDescription}
              </p>

              {/* Technologies */}
              <div className="mt-6">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                  Technologies Used:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-500 transition-colors flex items-center gap-2"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                    Visit Live Demo
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-white/10 border border-white/15 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <GithubIcon className="w-4 h-4" />
                    View Source Code
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioProjects;
