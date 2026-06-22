import { useState } from 'react';
import Layout from '../components/Layout';
import VID from '../utils/video';

const SAMPLE_VIDEOS = [
  { id: 1, title: 'How to Inspect a Used Car Before Buying', url: 'https://www.youtube.com/watch?v=y1P7P_1kFfU', category: 'buying' },
  { id: 2, title: 'Understanding Car Insurance in Ghana', url: 'https://www.youtube.com/watch?v=F3G8D5z8l4o', category: 'insurance' },
  { id: 3, title: 'Maintenance Tips for Tropical Climates', url: 'https://www.youtube.com/watch?v=aG04B5xXNf0', category: 'maintenance' },
  { id: 4, title: 'Car Financing Options Explained', url: 'https://www.youtube.com/watch?v=7uVmsBfQ2pU', category: 'financing' },
];

const CATEGORIES = ['all', 'buying', 'selling', 'maintenance', 'insurance', 'financing'];

export default function Education() {
  const [category, setCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);

  const filtered = category === 'all' ? SAMPLE_VIDEOS : SAMPLE_VIDEOS.filter(v => v.category === category);

  return (
    <Layout activePage="education">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb"><a href="/">Home</a><span className="breadcrumb-sep">›</span><span>Education Hub</span></div>
          <h1>Education Hub</h1>
          <p>Learn everything about buying, selling, and maintaining cars in Ghana</p>
        </div>
      </div>

      <section className="section">
        <div className="chip-row">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`chip ${category === c ? 'active' : ''}`}>
              {c === 'all' ? 'All Topics' : c}
            </button>
          ))}
        </div>

        {activeVideo && (
          <div className="video-embed">
            <iframe src={VID.embed(activeVideo.url)} allow="autoplay; encrypted-media" allowFullScreen title={activeVideo.title}></iframe>
          </div>
        )}

        <div className="grid-3">
          {filtered.map(v => (
            <div key={v.id} onClick={() => setActiveVideo(v)} className="edu-card">
              <div className="edu-thumb">
                <img src={VID.thumb(v.url)} alt={v.title} />
                <div className="edu-play-overlay">
                  <i className="bi bi-play-circle-fill"></i>
                </div>
              </div>
              <div className="card-body">
                <div className="edu-title">{v.title}</div>
                <div className="edu-cat">{v.category}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
