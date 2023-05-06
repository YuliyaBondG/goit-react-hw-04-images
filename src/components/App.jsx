import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getSearch } from 'services/api';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';

export const App = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (search === '') return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getSearch(search, page);

        if (data.hits.length === 0) {
          setEmpty(true);
        }

        setImages(prevImages => [...prevImages, ...data.hits]);
        setTotal(data.totalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, page]);

  const handleSubmit = newSearch => {
    setSearch(newSearch);
    setImages([]);
    setPage(1);
    setTotal(0);
    setLoading(false);
    setEmpty(false);
  };

  const clickLoad = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = (largeImageUrl, alt) => {
    setShowModal(true);
    setLargeImageURL(largeImageUrl);
    setAlt(alt);
  };

  const closeModal = () => {
    setShowModal(false);
    setLargeImageURL('');
    setAlt('');
  };

  return (
    <div>
      <ToastContainer
        toastOptions={{
          duration: 1500,
        }}
      />

      <Searchbar handleSubmit={handleSubmit} />
      {error && (
        <h2 style={{ textAlign: 'center' }}>
          Something went wrong: ({error})!
        </h2>
      )}
      <ImageGallery togleModal={openModal} images={images} />
      {loading && <Loader />}
      {empty && (
        <h2 style={{ textAlign: 'center' }}>
          Sorry. There are no images ... 😭
        </h2>
      )}
      {!loading && images.length !== total && <Button clickLoad={clickLoad} />}
      {showModal && (
        <Modal closeModal={closeModal}>
          <img src={largeImageURL} alt={alt} />
        </Modal>
      )}
    </div>
  );
};
