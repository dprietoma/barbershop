import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Storage } from '@angular/fire/storage';
import { getDownloadURL, ref } from 'firebase/storage';
import { StoriesService } from '../../../../services/stories.service';
import { Story } from '../../../../utils/interface/story-interface';
import { SessionStorageService } from '../../../../utils/global/StorageService ';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-carousel-indicators',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './carousel-indicators.component.html',
  styleUrl: './carousel-indicators.component.css'
})
export class CarouselIndicatorsComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  stories: Story[] = [];
  storyUrls: { type: 'image' | 'video'; url: string }[] = [];
  currentIndex = 0;
  progress = 0;
  interval: any;
  step = 1;
  user: string | null;
  showVideo = true;
  private videoEndedAttached = false;
  contentReady = false;
  isMuted = true;
  name: string = '';
  urlLogoReel: string = '';
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  constructor(
    private storage: Storage,
    private storyImg: StoriesService,
    private sessionStorage: SessionStorageService
  ) {
    this.user = this.sessionStorage.getType('mode');
    this.name = this.user === 'CRISTIANBARBER' ? 'CRISTIANBARBER' : 'AMATE';
    this.urlLogoReel = this.user === 'CRISTIANBARBER' ? 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/logos%26varios%2FlogoCristianBlack.png?alt=media&token=63fa1c6e-9f40-40bb-abd1-4b7b93cf6457'
      : 'https://firebasestorage.googleapis.com/v0/b/barbershop-1e2aa.firebasestorage.app/o/logos%26varios%2FlogoAmateBlack.png?alt=media&token=1cdde7d9-70ba-4b7a-902e-81b87a3602b3';
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    this.consultStories();
  }

  ngOnDestroy() {
    this.clearProgress();
  }

  ngAfterViewChecked(): void {
    if (
      this.isVideo(this.currentIndex) &&
      this.videoPlayerRef &&
      this.videoPlayerRef.nativeElement &&
      !this.videoEndedAttached
    ) {
      this.videoPlayerRef.nativeElement.onended = () => {
        console.log('Video terminó (ViewChild)');
        this.onVideoEnded();
      };
      this.videoEndedAttached = true;
    }

    if (!this.isVideo(this.currentIndex)) {
      this.videoEndedAttached = false;
    }
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.videoPlayerRef?.nativeElement) {
      this.videoPlayerRef.nativeElement.muted = this.isMuted;
    }
  }

  consultStories() {
    this.storyImg.getStories(this.user as string).subscribe((stories) => {
      this.stories = stories;
      this.loadStories();
    });
  }

  loadStories() {
    const promises = this.stories.map(async (story) => {
      if (story.type === 'video') {
        const videoRef = ref(this.storage, story.path);
        const url = await getDownloadURL(videoRef);
        return { type: 'video', url };
      } else {
        return { type: 'image', url: story.url };
      }
    });

    Promise.all(promises).then((result) => {
      this.storyUrls = result as any;

      if (!this.isVideo(this.currentIndex)) {
        this.step = 1;
        this.startProgress();
      }
    });
  }

  isVideo(index: number): boolean {
    return this.storyUrls[index]?.type === 'video';
  }

  onVideoLoaded(video: HTMLVideoElement) {
    console.log('Video cargado con duración:', video.duration);
  }

  onVideoEnded() {
    this.nextStory();
  }

  startProgress() {
    this.clearProgress();
    this.progress = 0;

    this.interval = setInterval(() => {
      this.progress += this.step;
      if (this.progress >= 100) {
        this.nextStory();
      }
    }, 50);
  }

  clearProgress() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  nextStory() {
    this.clearProgress();
    this.isMuted = true;
    this.progress = 0;
    this.showVideo = false;
    this.contentReady = false;

    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.storyUrls.length;
      this.videoEndedAttached = false;
      this.showVideo = true;

      setTimeout(() => {
        this.contentReady = true;
      }, 50);

      if (!this.isVideo(this.currentIndex)) {
        this.step = 1;
        this.startProgress();
      }
    });
  }

  prevStory() {
    this.clearProgress();
    this.isMuted = true;
    this.progress = 0;
    this.contentReady = false;
    this.currentIndex =
      this.currentIndex > 0
        ? this.currentIndex - 1
        : this.storyUrls.length - 1;

    this.videoEndedAttached = false;

    setTimeout(() => {
      this.contentReady = true;
    }, 50);

    if (!this.isVideo(this.currentIndex)) {
      this.step = 1;
      this.startProgress();
    }
  }

}
