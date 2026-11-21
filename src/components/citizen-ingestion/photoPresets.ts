import type { GrievanceSector, GrievanceUrgency } from '../../shared/types';

/** Preset infrastructure defect photograph metadata for quick vision triage testing. */
export interface SamplePhotoPreset {
  id: string;
  title: string;
  url: string;
  sector: GrievanceSector;
  urgency: GrievanceUrgency;
  language: string;
  region: string;
  text: string;
}

export const SAMPLE_PHOTO_PRESETS: readonly SamplePhotoPreset[] = [
  {
    id: 'jal-jeevan-madurai',
    title: 'Ruptured Jal Jeevan Main Pipe (Madurai)',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=60',
    sector: 'Water & Sanitation',
    urgency: 'Emergency',
    language: 'Tamil',
    region: 'Tamil Nadu (Madurai / Melur Taluk)',
    text: 'Main drinking water pipeline under the Jal Jeevan mission ruptured in Melur block. 180 households have had no clean water supply for 12 days.',
  },
  {
    id: 'road-culvert-tirunelveli',
    title: 'Collapsed Road Culvert (Tirunelveli)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60',
    sector: 'Roads & Highways',
    urgency: 'High',
    language: 'Tamil',
    region: 'Tamil Nadu (Tirunelveli / Ambasamudram)',
    text: 'Flash floods caused major 4-foot deep fissures on the PMGSY connecting highway, blocking primary emergency and ambulance access.',
  },
  {
    id: 'dry-cistern-bahia',
    title: 'Dry Cistern & Leaking Manifold (Bahia Sertão)',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=60',
    sector: 'Water & Sanitation',
    urgency: 'High',
    language: 'Portuguese',
    region: 'Bahia (Feira de Santana / Sertão District)',
    text: 'A tubulação do Novo PAC Água para Todos está com vazamento grave há 3 semanas no bairro Campo Limpo. Mais de 400 famílias sem água tratada durante a seca.',
  },
  {
    id: 'clinic-power-asyut',
    title: 'Rural Clinic Power Failure (Asyut)',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60',
    sector: 'Healthcare',
    urgency: 'Emergency',
    language: 'Arabic',
    region: 'Asyut (Dairut District / Upper Egypt)',
    text: 'Decent Life project: primary health center generator out of service for two months, risking refrigeration storage of essential pediatric vaccines.',
  },
];
