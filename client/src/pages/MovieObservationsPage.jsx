import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'

// Modals
import NewObservationModal from '../components/modals/NewObservationModal'
import UploadAnalysisModal from '../components/modals/UploadAnalysisModal'
import ManageScenesModal from '../components/modals/ManageScenesModal'

// Components
import ObservationPost from '../components/observations/ObservationPost'
import AnalysisPost from '../components/observations/AnalysisPost'
import SceneList from '../components/observations/SceneList'

export default function MovieObservationsPage() {
  const { movieId } = useParams()
  const { user } = useAuth()

  const [observations, setObservations] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [scenes, setScenes] = useState([])

  const [showObservationModal, setShowObservationModal] = useState(false)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [showScenesModal, setShowScenesModal] = useState(false)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [obsRes, anaRes, scnRes] = await Promise.all([
          axios.get(`/observations/${movieId}`),
          axios.get(`/analyses/${movieId}`),
          axios.get(`/scenes/${movieId}`)
        ])
        setObservations(obsRes.data)
        setAnalyses(anaRes.data)
        setScenes(scnRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [movieId])

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Movie Observations</h1>
        {user && (
          <div className="space-x-2">
            <button onClick={() => setShowObservationModal(true)} className="btn-primary">
              New Observation
            </button>
            <button onClick={() => setShowAnalysisModal(true)} className="btn-primary">
              Upload Analysis
            </button>
            <button onClick={() => setShowScenesModal(true)} className="btn-secondary">
              Manage Scenes
            </button>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Observations</h2>
      {observations.map(obs => (
        <ObservationPost
          key={obs.id}
          observation={obs}
          onLike={() => {}}
          onBookmark={() => {}}
        />
      ))}

      <h2 className="text-2xl font-semibold my-4">Analyses</h2>
      {analyses.map(ana => (
        <AnalysisPost
          key={ana.id}
          analysis={ana}
          onLike={() => {}}
          onBookmark={() => {}}
        />
      ))}

      <h2 className="text-2xl font-semibold my-4">Scenes</h2>
      <SceneList scenes={scenes} />

      {/* Modals */}
      {showObservationModal && <NewObservationModal onClose={() => setShowObservationModal(false)} onSubmit={() => {}} />}
      {showAnalysisModal && <UploadAnalysisModal onClose={() => setShowAnalysisModal(false)} onSubmit={() => {}} />}
      {showScenesModal && <ManageScenesModal onClose={() => setShowScenesModal(false)} scenes={scenes} />}
    </div>
  )
}
