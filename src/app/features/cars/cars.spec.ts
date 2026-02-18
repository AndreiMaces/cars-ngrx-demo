import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EntityCollectionServiceFactory, EntityCollectionService } from '@ngrx/data';
import { Car } from '../../core/models/car';
import { Cars } from './cars';

function createMockCarService(): Partial<EntityCollectionService<Car>> {
  return {
    entities$: of<Car[]>([]),
    loading$: of(false),
    errors$: of(null as any),
    load: jasmine.createSpy('load'),
  };
}

describe('Cars', () => {
  let component: Cars;
  let fixture: ComponentFixture<Cars>;
  let mockCarService: Partial<EntityCollectionService<Car>>;

  beforeEach(async () => {
    mockCarService = createMockCarService();
    await TestBed.configureTestingModule({
      imports: [Cars],
      providers: [
        {
          provide: EntityCollectionServiceFactory,
          useValue: {
            create: () => mockCarService,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Cars);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call load on init', () => {
    expect(mockCarService.load).toHaveBeenCalled();
  });
});
