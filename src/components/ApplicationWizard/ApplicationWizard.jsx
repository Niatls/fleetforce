import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Plus, Trash2, Upload, FileText, Download, UserCheck, ShieldCheck, Printer } from 'lucide-react';
import { MARITIME_RANKS, VESSEL_TYPES, getRankLabel, getVesselLabel, getEnglishLevelLabel, ENGLISH_LEVELS_TRANSLATIONS } from '../../data/initialData';

export const ApplicationWizard = ({ isOpen, onClose, initialRank = '', initialVesselType = '', onSubmitSuccess }) => {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    citizenship: 'Россия',
    address: '',
    phone: '',
    email: '',
    nearestAirport: '',
    shoeSize: '42',
    overallSize: 'L / 50',

    appliedRank: initialRank || MARITIME_RANKS[0],
    alternativeRank: 'Chief Officer / 1st Mate',
    minSalary: '8000',
    readyDate: new Date().toISOString().split('T')[0],
    preferredVessels: initialVesselType || VESSEL_TYPES[0],
    englishLevel: 'Good / Upper-Intermediate',

    passportNo: '',
    passportExpiry: '',
    seamanBookNo: '',
    seamanBookExpiry: '',
    stcwBasic: true,
    marlinsScore: '85',
    usVisa: 'C1/D',
    schengenVisa: 'Yes',

    seaService: [
      {
        id: 1,
        vesselName: '',
        vesselType: 'Chemical Tanker',
        dwtGrt: '47,000 DWT',
        engineBhp: 'MAN B&W 9,800 KW',
        rankHeld: initialRank || 'Chief Officer',
        manningCompany: '',
        dateFrom: '',
        dateTo: ''
      }
    ],

    cvFileName: '',
    photoFileName: '',
    consent: false
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSeaServiceChange = (index, field, value) => {
    const updated = [...formData.seaService];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, seaService: updated }));
  };

  const addVesselRecord = () => {
    setFormData((prev) => ({
      ...prev,
      seaService: [
        ...prev.seaService,
        {
          id: Date.now(),
          vesselName: '',
          vesselType: 'Oil Tanker',
          dwtGrt: '',
          engineBhp: '',
          rankHeld: formData.appliedRank,
          manningCompany: '',
          dateFrom: '',
          dateTo: ''
        }
      ]
    }));
  };

  const removeVesselRecord = (index) => {
    if (formData.seaService.length === 1) return;
    const updated = formData.seaService.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, seaService: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Пожалуйста, подтверите согласие на обработку персональных данных!');
      return;
    }

    const newCandidate = {
      id: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: formData.fullName || 'Моряк Кандидат',
      dob: formData.dob,
      citizenship: formData.citizenship,
      phone: formData.phone,
      email: formData.email,
      appliedRank: formData.appliedRank,
      alternativeRank: formData.alternativeRank,
      minSalary: formData.minSalary,
      readyDate: formData.readyDate,
      preferredVessels: formData.preferredVessels,
      status: 'New',
      marlinsScore: `${formData.marlinsScore}%`,
      englishLevel: formData.englishLevel,
      seaService: formData.seaService,
      submittedAt: new Date().toISOString()
    };

    onSubmitSuccess(newCandidate);
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" style={{ overflowY: 'auto' }}>
      <div className="modal-content" style={{ maxWidth: '960px', padding: '2.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>IMO & BGI STANDARD APPLICATION</div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF' }}>{t('wizard.title')}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={26} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--color-emerald-light)',
              color: 'var(--color-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <CheckCircle2 size={42} />
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#FFFFFF' }}>
              {t('wizard.successMsg')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Ваша морская анкета зарегистрирована в общей базе крюингового альянса. Менеджер по подбору экипажей свяжется с вами по указанному телефону или мессенджеру.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => window.print()} className="btn btn-secondary">
                <Printer size={18} /> Распечатать / Сохранить в PDF
              </button>
              <button onClick={onClose} className="btn btn-primary">
                Вернуться на сайт
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '0.5rem', overflowX: 'auto' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <div 
                  key={s} 
                  onClick={() => setStep(s)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                    background: step === s ? 'var(--color-accent-light)' : 'rgba(255,255,255,0.03)',
                    border: step === s ? '1px solid var(--color-accent)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: step === s ? 'var(--color-accent)' : 'var(--text-muted)', fontWeight: 700 }}>
                    {s === 1 && t('wizard.step1Title')}
                    {s === 2 && t('wizard.step2Title')}
                    {s === 3 && t('wizard.step3Title')}
                    {s === 4 && t('wizard.step4Title')}
                    {s === 5 && t('wizard.step5Title')}
                  </div>
                </div>
              ))}
            </div>

            {/* Step Forms */}
            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">{t('wizard.fullName')} *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Иванов Иван Иванович / Ivanov Ivan" 
                      className="form-input"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.dob')}</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={formData.dob}
                      onChange={(e) => handleChange('dob', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.citizenship')}</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={formData.citizenship}
                      onChange={(e) => handleChange('citizenship', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.phone')} *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+7 (900) 000-00-00" 
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.email')} *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="seaman@example.com" 
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.nearestAirport')}</label>
                    <input 
                      type="text" 
                      placeholder="Москва (SVO/DME) / СПб (LED)" 
                      className="form-input"
                      value={formData.nearestAirport}
                      onChange={(e) => handleChange('nearestAirport', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.shoeSize')} / {t('wizard.overallSize')}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Обувь (e.g. 43)" 
                        className="form-input"
                        value={formData.shoeSize}
                        onChange={(e) => handleChange('shoeSize', e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Одежда (e.g. XL)" 
                        className="form-input"
                        value={formData.overallSize}
                        onChange={(e) => handleChange('overallSize', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('wizard.appliedRank')} *</label>
                    <select 
                      className="form-select"
                      value={formData.appliedRank}
                      onChange={(e) => handleChange('appliedRank', e.target.value)}
                    >
                      {MARITIME_RANKS.map((r) => (
                        <option key={r} value={r}>{getRankLabel(r, lang)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.alternativeRank')}</label>
                    <select 
                      className="form-select"
                      value={formData.alternativeRank}
                      onChange={(e) => handleChange('alternativeRank', e.target.value)}
                    >
                      {MARITIME_RANKS.map((r) => (
                        <option key={r} value={r}>{getRankLabel(r, lang)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.minSalary')}</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={formData.minSalary}
                      onChange={(e) => handleChange('minSalary', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.readyDate')}</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={formData.readyDate}
                      onChange={(e) => handleChange('readyDate', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.preferredVessels')}</label>
                    <select 
                      className="form-select"
                      value={formData.preferredVessels}
                      onChange={(e) => handleChange('preferredVessels', e.target.value)}
                    >
                      {VESSEL_TYPES.map((v) => (
                        <option key={v} value={v}>{getVesselLabel(v, lang)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.englishLevel')}</label>
                    <select 
                      className="form-select"
                      value={formData.englishLevel}
                      onChange={(e) => handleChange('englishLevel', e.target.value)}
                    >
                      {Object.keys(ENGLISH_LEVELS_TRANSLATIONS).map((lvl) => (
                        <option key={lvl} value={lvl}>{getEnglishLevelLabel(lvl, lang)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('wizard.passportNo')}</label>
                    <input 
                      type="text" 
                      placeholder="75 N 1234567" 
                      className="form-input"
                      value={formData.passportNo}
                      onChange={(e) => handleChange('passportNo', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.passportExpiry')}</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={formData.passportExpiry}
                      onChange={(e) => handleChange('passportExpiry', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.seamanBookNo')}</label>
                    <input 
                      type="text" 
                      placeholder="УЛМ / Seaman Book ID" 
                      className="form-input"
                      value={formData.seamanBookNo}
                      onChange={(e) => handleChange('seamanBookNo', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.marlinsScore')}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 88%" 
                      className="form-input"
                      value={formData.marlinsScore}
                      onChange={(e) => handleChange('marlinsScore', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.usVisa')}</label>
                    <input 
                      type="text" 
                      placeholder="C1/D Valid till 2028" 
                      className="form-input"
                      value={formData.usVisa}
                      onChange={(e) => handleChange('usVisa', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('wizard.schengenVisa')}</label>
                    <input 
                      type="text" 
                      placeholder="Schengen Visa Multi" 
                      className="form-input"
                      value={formData.schengenVisa}
                      onChange={(e) => handleChange('schengenVisa', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h4 style={{ color: 'var(--color-accent)' }}>{t('wizard.seaServiceTitle')}</h4>
                    <button type="button" onClick={addVesselRecord} className="btn btn-secondary btn-sm">
                      <Plus size={16} /> {t('wizard.addVesselBtn')}
                    </button>
                  </div>

                  {formData.seaService.map((item, idx) => (
                    <div 
                      key={item.id || idx} 
                      className="glass-card" 
                      style={{ padding: '1.2rem', marginBottom: '1rem', background: 'rgba(21, 39, 66, 0.6)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--color-gold)' }}>Судно #{idx + 1}</strong>
                        {formData.seaService.length > 1 && (
                          <button type="button" onClick={() => removeVesselRecord(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                        <input 
                          type="text" 
                          placeholder={t('wizard.vesselName')}
                          className="form-input"
                          value={item.vesselName}
                          onChange={(e) => handleSeaServiceChange(idx, 'vesselName', e.target.value)}
                        />
                        <select 
                          className="form-select"
                          value={item.vesselType}
                          onChange={(e) => handleSeaServiceChange(idx, 'vesselType', e.target.value)}
                        >
                          {VESSEL_TYPES.map((v) => (
                            <option key={v} value={v}>{getVesselLabel(v, lang)}</option>
                          ))}
                        </select>

                        <input 
                          type="text" 
                          placeholder={t('wizard.dwtGrt')}
                          className="form-input"
                          value={item.dwtGrt}
                          onChange={(e) => handleSeaServiceChange(idx, 'dwtGrt', e.target.value)}
                        />

                        <input 
                          type="text" 
                          placeholder={t('wizard.engineBhp')}
                          className="form-input"
                          value={item.engineBhp}
                          onChange={(e) => handleSeaServiceChange(idx, 'engineBhp', e.target.value)}
                        />

                        <input 
                          type="text" 
                          placeholder={t('wizard.rankHeld')}
                          className="form-input"
                          value={item.rankHeld}
                          onChange={(e) => handleSeaServiceChange(idx, 'rankHeld', e.target.value)}
                        />

                        <input 
                          type="text" 
                          placeholder={t('wizard.manningCompany')}
                          className="form-input"
                          value={item.manningCompany}
                          onChange={(e) => handleSeaServiceChange(idx, 'manningCompany', e.target.value)}
                        />

                        <input 
                          type="date" 
                          title={t('wizard.dateFrom')}
                          className="form-input"
                          value={item.dateFrom}
                          onChange={(e) => handleSeaServiceChange(idx, 'dateFrom', e.target.value)}
                        />

                        <input 
                          type="date" 
                          title={t('wizard.dateTo')}
                          className="form-input"
                          value={item.dateTo}
                          onChange={(e) => handleSeaServiceChange(idx, 'dateTo', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', border: '2px dashed var(--border-color)' }}>
                    <Upload size={36} color="var(--color-accent)" style={{ marginBottom: '0.8rem' }} />
                    <h4>{t('wizard.uploadCv')}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Форматы PDF, DOCX, JPG до 15 Мб
                    </p>
                    <input 
                      type="file" 
                      onChange={(e) => handleChange('cvFileName', e.target.files[0]?.name || '')}
                      style={{ margin: '0 auto' }}
                    />
                    {formData.cvFileName && (
                      <div style={{ marginTop: '0.8rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                        <FileText size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        {formData.cvFileName}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <input 
                      type="checkbox" 
                      id="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => handleChange('consent', e.target.checked)}
                      style={{ marginTop: '4px', width: '18px', height: '18px' }}
                    />
                    <label htmlFor="consent" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      {t('wizard.privacyConsent')}
                    </label>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="btn btn-secondary">
                    <ChevronLeft size={18} /> {t('wizard.prevBtn')}
                  </button>
                ) : <div />}

                {step < 5 ? (
                  <button type="button" onClick={() => setStep(step + 1)} className="btn btn-primary">
                    {t('wizard.nextBtn')} <ChevronRight size={18} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-accent btn-lg">
                    <CheckCircle2 size={20} /> {t('wizard.submitBtn')}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
