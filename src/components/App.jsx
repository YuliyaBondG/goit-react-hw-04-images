import { Component } from 'react';
import { Toaster } from 'react-hot-toast';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getSearch } from 'services/api';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';

export class App extends Component {
  state = {
    search: '',
    images: [],
    page: 1,
    total: 0,
    loading: false,
    error: null,
    showModal: false,
    empty: false,
    largeImageURL: '',
    alt: '',
  };

  componentDidUpdate(_, prevState) {
    const { search, page } = this.state;
    if (prevState.search !== search || prevState.page !== page) {
      this.getFunc(search, this.page);
    }
  }

  getFunc = (text, page) => {
    this.setState({ loading: true, error: null });

    getSearch(text, page)
      .then(data => {
        if (data.hits.length === 0) {
          this.setState({ empty: true });
        }
        this.setState(prevSt => ({
          images: [...prevSt.images, ...data.hits],
          total: data.totalHits,
        }));
      })
      .catch(error => {
        this.setState({ error: error.message });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  clickLoad = () => {
    this.setState(prevSt => ({
      page: prevSt.page + 1,
    }));
  };

  openModal = (largeImageURL, alt) => {
    this.setState(({ showModal }) => {
      return { showModal: !showModal, largeImageURL, alt };
    });
  };

  handleSubmit = search => {
    this.setState({
      search,
      images: [],
      page: 1,
      total: 0,
      loading: false,

      empty: false,
    });
  };

  closeModal = () => {
    this.setState(({ showModal }) => {
      return { showModal: !showModal, largeImageURL: '', alt: '' };
    });
  };

  render() {
    const { error, loading, images, total } = this.state;
    return (
      <div>
        <Toaster
          toastOptions={{
            duration: 1500,
          }}
        />

        <Searchbar handleSubmit={this.handleSubmit} />
        {error && (
          <h2 style={{ textAlign: 'center' }}>
            Something went wrong: ({error})!
          </h2>
        )}
        <ImageGallery togleModal={this.openModal} images={images} />
        {loading && <Loader />}
        {this.state.empty && (
          <h2 style={{ textAlign: 'center' }}>
            Sorry. There are no images ... 😭
          </h2>
        )}
        {!loading && images.length !== total && (
          <Button clickLoad={this.clickLoad} />
        )}
        {this.state.showModal && (
          <Modal closeModal={this.closeModal}>
            <img src={this.state.largeImageURL} alt={this.state.alt} />
          </Modal>
        )}
      </div>
    );
  }
}
