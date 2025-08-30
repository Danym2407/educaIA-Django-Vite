
import React from 'react';
import { motion } from 'framer-motion';

const LabPage = () => {
  return (
    <div className="container py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-primary"
      >
        Laboratorio Integrado
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-muted-foreground"
      >
        Esta sección ha sido reemplazada por "Demos". La funcionalidad de Laboratorio Integrado está actualmente en desarrollo y se reintroducirá en una futura actualización.
      </motion.p>
    </div>
  );
};

export default LabPage;
  