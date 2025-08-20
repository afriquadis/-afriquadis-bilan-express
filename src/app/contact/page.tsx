"use client";
import { useState } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    diagnosticResult: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
    // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        diagnosticResult: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
  return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
              </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Message envoyé !</h2>
          <p className="text-green-700 mb-6">
            Merci pour votre message. Notre équipe vous contactera dans les plus brefs délais.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Envoyer un autre message
          </button>
          </div>
        </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-afriquadis-50 via-orange-50 to-darkBlue-50 opacity-60 rounded-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-afriquadis-600 via-orange-500 to-darkBlue-600 bg-clip-text text-transparent">
          Contactez-nous
            </h1>
          <p className="text-xl text-darkBlue-700 max-w-3xl mx-auto font-medium">
          Notre équipe d'experts est là pour vous accompagner dans votre parcours de santé
            </p>
        </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
            {/* Informations de contact */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-darkBlue-800 mb-6">Informations de contact</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-afriquadis-50 to-orange-50 rounded-lg border border-afriquadis-100">
                <div className="w-12 h-12 bg-gradient-to-br from-afriquadis-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 10.26c-.635.635-.635 1.664 0 2.299l5.281 5.281c.635.635 1.664.635 2.299 0l.833-1.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V21a2 2 0 01-2 2h-1C9.716 23 2 15.284 2 5V4z" />
                      </svg>
                    </div>
                    <div>
                  <h3 className="font-semibold text-darkBlue-800">Téléphone</h3>
                  <p className="text-afriquadis-600 font-medium">+228 92543376</p>
                    </div>
                  </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">contact@afriquadis.com</p>
                    </div>
                  </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                  <h3 className="font-semibold text-gray-800">Adresse</h3>
                  <p className="text-gray-600">AVEDJI SUN-CITY (Lomé - Togo)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons de contact rapide */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Contact rapide</h2>
            <WhatsAppButton 
              phoneNumber="+22892543376"
              message="Bonjour, j'aimerais parler à un expert AFRIQUADIS pour plus d'informations."
              variant="inline" 
            />
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6">Envoyez-nous un message</h2>
          
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Votre nom complet"
                  value={formData.name}
                  onChange={handleInputChange}
                      />
                    </div>

                    <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                      />
                    </div>
                  </div>

            <div className="grid md:grid-cols-2 gap-6">
                  <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+228 92543376"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                <label htmlFor="diagnosticResult" className="block text-sm font-semibold text-gray-700 mb-2">
                  Résultat diagnostic (optionnel)
                </label>
                <input
                  type="text"
                  id="diagnosticResult"
                  name="diagnosticResult"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Paludisme, Anémie, etc."
                  value={formData.diagnosticResult}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={formData.subject}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionnez un sujet</option>
                <option value="diagnostic">Question sur un diagnostic</option>
                <option value="produits">Informations sur les produits</option>
                <option value="technique">Support technique</option>
                <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Décrivez votre demande en détail..."
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              } text-white`}
                  >
                    {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </span>
                    ) : (
                      'Envoyer le message'
                    )}
                  </button>
                </form>
          </div>
        </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 AFRIQUADIS - Bilan Express. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Bouton WhatsApp flottant */}
      <WhatsAppButton />
    </div>
  );
}
