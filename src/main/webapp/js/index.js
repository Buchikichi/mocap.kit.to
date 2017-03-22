document.addEventListener('DOMContentLoaded', function() {
	new AppMain();
	new TitleBg();
});

class AppMain {
	/**
	 * インスタンス生成.
	 */
	constructor() {
		this.product = new Product();
		this.product.list().then((data)=> {
			this.setResult(data);
		});
		this.selectedId = '';
		this.detailPage = null;
		$(document).on('pagecontainerload', (e, d)=> {
			//console.log(d.dataUrl);
			//console.log(e);
			this.detailPage = d.toPage;
			this.showDetail();
		});
	}

	setResult(list) {
		// <li><a><img src="img/icon.listview.png"/><span>プロダクト</span><p>説明</p><span class="ui-li-count">22</span></a></li>
		let listView = document.getElementById('listView');

		list.forEach((rec)=> {
			let li = this.createRow(rec);

			//console.log('name:' + rec.name);
			listView.append(li);
		});
		$(listView).listview('refresh');
	}

	createRow(rec) {
		let img = document.createElement('img');
		let name = document.createElement('span');
		let description = document.createElement('p');
		let count = document.createElement('span');
		let anchor = document.createElement('a');
		let li = document.createElement('li');

		img.setAttribute('src', 'img/icon.listview.png');
		name.innerText = rec.name;
		description.innerText = rec.description;
		count.classList.add('ui-li-count');
		count.innerText = rec.count;
		anchor.append(img);
		anchor.append(name);
		anchor.append(description);
		anchor.append(count);
		anchor.setAttribute('href', 'detail.html?' + rec.id);
		li.append(anchor);
		//
		$(anchor).click(()=>{
			this.selectedId = rec.id;
		});
		return li;
	}

	showDetail() {
		let page = this.detailPage;
		let name = page.find('#name');
		let description = page.find('#description');

		//console.log('selectedId:' + this.selectedId);
		this.product.detail(this.selectedId).then((data)=> {
			//console.log(data);
			name.text(data.name);
			description.text(data.description);
		});
	}
}

class TitleBg {
	constructor() {
		this.x = 0;
		this.width = 1200;
		this.move();
	}
	move() {
		let header = document.querySelector('div[data-role=header]');

		header.style.backgroundPosition = (-this.x) + 'px 0';
		this.x++;
		if (this.width < this.x) {
			this.x = 0;
		}
		setTimeout(()=> {
			this.move();
		}, 2000);
	}
}

/**
 * プロダクト.
 */
class Product {
	/**
	 * プロダクト一覧.
	 */
	list() {
		let data = {};

		return $.ajax({
			type: 'post',
			url: 'amc/list',
			dataType: 'json',
			data: data,
		});
	}

	/**
	 * プロダクト詳細.
	 * @param id
	 */
	detail(id) {
		let data = {id:id};

		return $.ajax({
			type: 'post',
			url: 'amc/detail',
			dataType: 'json',
			data: data,
		});
	}
}
