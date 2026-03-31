import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should emit success message', (done) => {
    service.toast$.subscribe(msg => {
      expect(msg).toEqual({ type: 'success', text: 'OK' });
      done();
    });
    service.showSuccess('OK');
  });

  it('should auto-clear after 3 seconds', () => {
    const nextSpy = jest.spyOn(service['toastSubject'], 'next');
    service.showSuccess('Test');
    expect(nextSpy).toHaveBeenCalledWith({ type: 'success', text: 'Test' });
    jest.advanceTimersByTime(3000);
    expect(nextSpy).toHaveBeenCalledWith(null);
  });
});
